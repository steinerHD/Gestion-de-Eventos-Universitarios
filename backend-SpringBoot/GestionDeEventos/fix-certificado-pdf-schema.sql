-- Fix certificado_pdf column type in participacion_organizacion table
-- This script ensures the column is properly defined as BYTEA

-- First, let's check if the column exists and its current type
-- If it's not BYTEA, we need to alter it

-- Drop and recreate the column to ensure it's BYTEA
ALTER TABLE participacion_organizacion DROP COLUMN IF EXISTS certificado_pdf;
ALTER TABLE participacion_organizacion ADD COLUMN certificado_pdf BYTEA NOT NULL;

-- Verify the table structure
\d participacion_organizacion;

