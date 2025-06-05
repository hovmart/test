-- Add missing columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Nigeria',
ADD COLUMN IF NOT EXISTS land_size DECIMAL,
ADD COLUMN IF NOT EXISTS land_unit VARCHAR(20),
ADD COLUMN IF NOT EXISTS square_feet INTEGER,
ADD COLUMN IF NOT EXISTS max_guests INTEGER,
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';

-- Update existing properties to have default values
UPDATE properties 
SET 
  country = 'Nigeria' WHERE country IS NULL,
  features = amenities WHERE features IS NULL OR features = '{}',
  max_guests = CASE 
    WHEN bedrooms IS NOT NULL THEN bedrooms * 2 + 2
    ELSE 4
  END
WHERE max_guests IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_verified ON properties(verified);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
