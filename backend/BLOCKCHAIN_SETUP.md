# Solana Blockchain Integration — Setup Guide

## What This Does
Every relief record is **hashed (SHA-256)** and the hash is **permanently stored on Solana blockchain** via the Memo Program. This makes records **tamper-proof** — anyone can verify that a record hasn't been modified by comparing the current hash with the on-chain hash.

- **Cost**: FREE on devnet (test network)
- **Speed**: ~400ms per transaction
- **Verification**: Public, anyone can check via Solana Explorer

---

## Quick Setup (3 minutes)

### 1. Install Python packages
```bash
cd backend
pip install solana solders
```

### 2. Run the database migration
Run this SQL in your Supabase SQL Editor (or via psql):
```sql
-- From: backend/migrations/add_blockchain_columns.sql
ALTER TABLE relief_records
ADD COLUMN IF NOT EXISTS solana_tx_signature TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS record_hash TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_relief_records_solana_tx
ON relief_records (solana_tx_signature)
WHERE solana_tx_signature IS NOT NULL;
```

### 3. Fund the devnet wallet
When you first start the backend, it auto-generates a Solana keypair (`solana_keypair.json`). Check the console for the wallet address, then fund it:

**Option A: Via terminal (if you have Solana CLI)**
```bash
solana airdrop 2 <WALLET_ADDRESS> --url devnet
```

**Option B: Via web faucet**
1. Go to https://faucet.solana.com/
2. Paste the wallet address from the console
3. Select "Devnet" and request SOL

The backend also auto-requests airdrops when balance is low.

### 4. Start the backend
```bash
cd backend
python -m app.main
```

That's it! New records are now automatically anchored to Solana.

---

## Optional Environment Variables
```env
# These all have defaults — only set if needed
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_KEYPAIR_PATH=solana_keypair.json
SOLANA_NETWORK=devnet
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/blockchain/status` | GET | Wallet address, balance, network info |
| `/blockchain/stats` | GET | How many records are anchored vs pending |
| `/blockchain/verify/{id}` | GET | Verify a specific record against its on-chain hash |
| `/blockchain/anchor/{id}` | POST | Manually anchor one record |
| `/blockchain/anchor-all` | POST | Anchor all un-anchored records (batch) |

---

## How Verification Works

1. **Record created** → backend computes `SHA-256(canonical_json(record))`
2. **Hash sent to Solana** → via Memo Program transaction: `NDRRMA|{record_id}|{hash}`
3. **TX signature stored** → saved in `relief_records.solana_tx_signature`
4. **Anyone verifies** → re-hash the record data, compare to stored hash, check TX exists on Solana Explorer

### Verification UI
- **SOLANA VERIFIED** (purple badge) = record has an on-chain transaction + matching hash
- **PENDING** (amber badge) = record not yet anchored (will be anchored on next attempt)

---

## For the Hackathon Demo

1. Run `POST /blockchain/anchor-all` to anchor all existing records
2. Create a new record via the province dashboard — it auto-anchors
3. Show the transparency page — verified badges with Solana Explorer links
4. Click a "SOLANA VERIFIED" badge → opens Solana Explorer showing the real transaction
5. Call `GET /blockchain/verify/{id}` → shows hash comparison and verification result

---

## Architecture

```
┌──────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│   Frontend        │────▸│   Backend (FastAPI)│────▸│  Solana Devnet  │
│   Transparency    │     │                   │     │  (Memo Program) │
│   Page            │◂────│   /blockchain/*   │◂────│                 │
│                   │     │   /records/*      │     │  TX: NDRRMA|    │
│ [SOLANA VERIFIED]─┼──▸  │                   │     │  {id}|{hash}    │
│  └─▸ Explorer     │     └───────┬───────────┘     └─────────────────┘
└──────────────────┘             │
                                 ▼
                         ┌───────────────┐
                         │   Supabase    │
                         │ relief_records│
                         │ + solana_tx   │
                         │ + record_hash │
                         └───────────────┘
```
