-- Pending PA leader assignments. Only a verified matching Auth email is activated.
BEGIN;
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS private.pa_pending_leaders (
  email TEXT PRIMARY KEY CHECK (email=lower(email) AND char_length(email) BETWEEN 5 AND 320),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
REVOKE ALL ON private.pa_pending_leaders FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.pa_sync_leader_from_auth()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF TG_OP='UPDATE' THEN
    IF lower(coalesce(OLD.email,'')) IS DISTINCT FROM lower(coalesce(NEW.email,''))
       AND EXISTS (SELECT 1 FROM private.pa_pending_leaders WHERE email=lower(OLD.email)) THEN
      DELETE FROM public.pa_leaders WHERE user_id=NEW.id;
    END IF;
  END IF;
  IF NEW.email_confirmed_at IS NOT NULL
     AND EXISTS (SELECT 1 FROM private.pa_pending_leaders WHERE email=lower(NEW.email)) THEN
    INSERT INTO public.pa_leaders(user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.pa_sync_leader_from_auth() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS pa_sync_leader_from_auth ON auth.users;
CREATE TRIGGER pa_sync_leader_from_auth
AFTER INSERT OR UPDATE OF email,email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION private.pa_sync_leader_from_auth();
COMMIT;
