-- Create fact_checks table in chat schema
CREATE TABLE IF NOT EXISTS chat.fact_checks (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES chat.rooms(id) ON DELETE CASCADE,
  message_id BIGINT NOT NULL REFERENCES chat.messages(id) ON DELETE CASCADE,
  original_message TEXT NOT NULL,
  claims JSONB NOT NULL,
  summary TEXT NOT NULL,
  contains_claims BOOLEAN NOT NULL DEFAULT TRUE,
  error TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(room_id, message_id)
);

-- Add RLS policies
ALTER TABLE chat.fact_checks ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users who are members of the room
CREATE POLICY "Authenticated users can read fact checks for rooms they are in" ON chat.fact_checks
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM chat.room_members WHERE room_id = chat.fact_checks.room_id
    )
  );

-- Allow insert access only to service role
CREATE POLICY "Service role can insert fact checks" ON chat.fact_checks
  FOR INSERT WITH CHECK (
    current_setting('role') = 'authenticated'
  );

-- Add index for faster lookups
CREATE INDEX ON chat.fact_checks (room_id);
CREATE INDEX ON chat.fact_checks (message_id);

-- Create notification function
CREATE OR REPLACE FUNCTION chat.notify_fact_check_inserted()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'fact-check-inserted',
    json_build_object(
      'id', NEW.id,
      'room_id', NEW.room_id,
      'message_id', NEW.message_id,
      'summary', NEW.summary,
      'contains_claims', NEW.contains_claims
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
CREATE TRIGGER fact_check_inserted
AFTER INSERT ON chat.fact_checks
FOR EACH ROW EXECUTE FUNCTION chat.notify_fact_check_inserted(); 