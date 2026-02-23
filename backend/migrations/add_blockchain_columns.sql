-- ============================================================
-- Add Solana blockchain anchoring columns to relief_records
-- ============================================================
-- This migration adds columns to store the Solana transaction
-- signature and record hash for each relief record, enabling
-- immutable on-chain verification.

-- Add blockchain columns
ALTER TABLE relief_records
ADD COLUMN IF NOT EXISTS solana_tx_signature TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS record_hash TEXT DEFAULT NULL;

-- Index for quick lookup by tx signature
CREATE INDEX IF NOT EXISTS idx_relief_records_solana_tx
ON relief_records (solana_tx_signature)
WHERE solana_tx_signature IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN relief_records.solana_tx_signature IS 'Solana transaction signature (base58) anchoring this record hash on-chain';
COMMENT ON COLUMN relief_records.record_hash IS 'SHA-256 hash of the canonical record data, also stored on-chain via Solana Memo';
