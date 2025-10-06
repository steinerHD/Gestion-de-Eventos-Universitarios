-- Fix participacion_organizacion table schema
-- This script ensures the certificado_pdf column is properly defined as BYTEA

-- Check current table structure
\d participacion_organizacion;

-- If the certificado_pdf column exists but is not BYTEA, drop and recreate it
DO $$
BEGIN
    -- Check if column exists and is not BYTEA
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'participacion_organizacion' 
        AND column_name = 'certificado_pdf' 
        AND data_type != 'bytea'
    ) THEN
        -- Drop the column if it's not BYTEA
        ALTER TABLE participacion_organizacion DROP COLUMN certificado_pdf;
        RAISE NOTICE 'Dropped certificado_pdf column (was not BYTEA)';
    END IF;
    
    -- Add the column as BYTEA if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'participacion_organizacion' 
        AND column_name = 'certificado_pdf'
    ) THEN
        ALTER TABLE participacion_organizacion ADD COLUMN certificado_pdf BYTEA NOT NULL;
        RAISE NOTICE 'Added certificado_pdf column as BYTEA';
    END IF;
END $$;

-- Verify the final table structure
\d participacion_organizacion;

-- Show the data types of all columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'participacion_organizacion' 
ORDER BY ordinal_position;
