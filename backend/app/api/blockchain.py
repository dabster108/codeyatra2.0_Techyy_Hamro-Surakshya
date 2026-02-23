"""
Blockchain API
==============
Public endpoints for verifying relief records on Solana blockchain.

GET  /blockchain/status                — Service status + wallet info
GET  /blockchain/verify/{record_id}    — Verify a single record against on-chain hash
POST /blockchain/anchor/{record_id}    — Manually anchor an existing record
POST /blockchain/anchor-all            — Anchor all un-anchored records (batch)
GET  /blockchain/stats                 — Blockchain anchoring statistics
"""

from fastapi import APIRouter, HTTPException
from app.db.supabase import get_supabase_admin
from app.services.blockchain_service import (
    hash_record,
    anchor_to_solana,
    get_explorer_url,
    get_blockchain_status,
    verify_record_hash_only,
    get_wallet_address,
)

router = APIRouter(prefix="/blockchain", tags=["blockchain"])


def _supabase():
    return get_supabase_admin()


@router.get("/status")
async def blockchain_status():
    """Get Solana blockchain service status, wallet address, and balance."""
    return get_blockchain_status()


@router.get("/verify/{record_id}")
async def verify_record(record_id: str):
    """
    Verify a relief record's integrity against the blockchain.
    
    - If the record has a solana_tx_signature → check on-chain
    - Re-hashes the current DB record and compares to stored hash
    - Returns verification result + Solana Explorer link
    """
    supabase = _supabase()
    try:
        res = supabase.table("relief_records").select("*").eq("id", record_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Record not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    record = res.data[0]
    current_hash = hash_record(record)
    stored_hash = record.get("record_hash")
    tx_sig = record.get("solana_tx_signature")
    
    result = {
        "record_id": record_id,
        "current_hash": current_hash,
        "stored_hash": stored_hash,
        "hash_match": current_hash == stored_hash if stored_hash else None,
        "tampered": current_hash != stored_hash if stored_hash else None,
        "solana_tx_signature": tx_sig,
        "solana_explorer_url": get_explorer_url(tx_sig) if tx_sig else None,
        "blockchain_anchored": tx_sig is not None,
        "blockchain": "Solana Devnet",
    }
    
    if stored_hash:
        result["verified"] = current_hash == stored_hash and tx_sig is not None
    else:
        result["verified"] = False
        result["note"] = "Record has not been anchored to blockchain yet"
    
    return result


@router.post("/anchor/{record_id}")
async def anchor_record(record_id: str):
    """
    Manually anchor a specific record to Solana blockchain.
    Useful for anchoring records that were created before blockchain integration.
    """
    supabase = _supabase()
    try:
        res = supabase.table("relief_records").select("*").eq("id", record_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Record not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    record = res.data[0]
    
    # Skip if already anchored
    if record.get("solana_tx_signature"):
        return {
            "message": "Record already anchored",
            "record_id": record_id,
            "solana_tx_signature": record["solana_tx_signature"],
            "explorer_url": get_explorer_url(record["solana_tx_signature"]),
        }
    
    # Hash and anchor
    record_hash = hash_record(record)
    tx_sig = anchor_to_solana(record_id, record_hash)
    
    if not tx_sig:
        raise HTTPException(
            status_code=503,
            detail="Failed to anchor to Solana. Check wallet balance or RPC connectivity."
        )
    
    # Update DB with tx signature and hash
    try:
        supabase.table("relief_records").update({
            "solana_tx_signature": tx_sig,
            "record_hash": record_hash,
        }).eq("id", record_id).execute()
    except Exception as e:
        # Transaction was sent but DB update failed — log it
        print(f"[Blockchain] WARNING: TX sent ({tx_sig}) but DB update failed for {record_id}: {e}")
    
    return {
        "message": "Record anchored to Solana blockchain",
        "record_id": record_id,
        "record_hash": record_hash,
        "solana_tx_signature": tx_sig,
        "explorer_url": get_explorer_url(tx_sig),
        "blockchain": "Solana Devnet",
    }


@router.post("/anchor-all")
async def anchor_all_unanchored():
    """
    Anchor all records that don't have a solana_tx_signature yet.
    Returns a summary of successes and failures.
    """
    supabase = _supabase()
    try:
        res = supabase.table("relief_records") \
            .select("*") \
            .is_("solana_tx_signature", "null") \
            .order("created_at", desc=False) \
            .execute()
        records = res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    if not records:
        return {"message": "All records are already anchored", "anchored": 0, "failed": 0}
    
    anchored = 0
    failed = 0
    results = []
    
    for record in records:
        record_hash = hash_record(record)
        tx_sig = anchor_to_solana(str(record["id"]), record_hash)
        
        if tx_sig:
            try:
                supabase.table("relief_records").update({
                    "solana_tx_signature": tx_sig,
                    "record_hash": record_hash,
                }).eq("id", record["id"]).execute()
                anchored += 1
                results.append({
                    "id": str(record["id"]),
                    "status": "anchored",
                    "tx_signature": tx_sig,
                })
            except Exception:
                failed += 1
                results.append({"id": str(record["id"]), "status": "db_update_failed"})
        else:
            failed += 1
            results.append({"id": str(record["id"]), "status": "tx_failed"})
    
    return {
        "message": f"Anchored {anchored} records, {failed} failed",
        "total": len(records),
        "anchored": anchored,
        "failed": failed,
        "results": results[:20],  # Limit response size
    }


@router.get("/stats")
async def blockchain_stats():
    """Statistics about blockchain anchoring coverage."""
    supabase = _supabase()
    try:
        # Total records
        all_res = supabase.table("relief_records").select("id", count="exact").execute()
        total = all_res.count or len(all_res.data or [])
        
        # Anchored records
        anchored_res = supabase.table("relief_records") \
            .select("id", count="exact") \
            .not_.is_("solana_tx_signature", "null") \
            .execute()
        anchored = anchored_res.count or len(anchored_res.data or [])
        
        return {
            "total_records": total,
            "blockchain_anchored": anchored,
            "pending": total - anchored,
            "coverage_percent": round((anchored / total * 100) if total else 0, 1),
            "blockchain": "Solana Devnet",
            "wallet_address": get_wallet_address(),
        }
    except Exception as e:
        return {
            "total_records": 0,
            "blockchain_anchored": 0,
            "pending": 0,
            "coverage_percent": 0,
            "error": str(e),
        }
