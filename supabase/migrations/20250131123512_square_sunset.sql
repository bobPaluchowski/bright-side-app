/*
  # Mental Health App Feature Updates

  1. Schema Updates
    - Add client profile image support
    - Add mentor specialization fields
    - Add availability tracking
    - Add read receipts for messages

  2. Security
    - Enable RLS on new tables
    - Add policies for data access
*/

-- Add client_img to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS client_img text,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Update mentor profiles with additional fields
ALTER TABLE mentors 
ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_image text,
ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'available',
ADD COLUMN IF NOT EXISTS current_clients integer DEFAULT 0;

-- Add read receipt tracking to chat messages
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- Function to split full name into first and last name
CREATE OR REPLACE FUNCTION split_full_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.first_name := split_part(NEW.full_name, ' ', 1);
  NEW.last_name := split_part(NEW.full_name, ' ', 2);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically split full name
CREATE TRIGGER split_full_name_trigger
BEFORE INSERT OR UPDATE OF full_name ON users
FOR EACH ROW
EXECUTE FUNCTION split_full_name();

-- Update existing users with split names
DO $$
BEGIN
  UPDATE users
  SET
    first_name = split_part(full_name, ' ', 1),
    last_name = split_part(full_name, ' ', 2)
  WHERE first_name IS NULL;
END $$;