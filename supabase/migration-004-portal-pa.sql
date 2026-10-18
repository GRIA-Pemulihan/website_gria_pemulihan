-- GRIA Portal PA. Existing prepared migration from the Portal PA package.
BEGIN;
CREATE TABLE IF NOT EXISTS public.pa_leaders (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pa_leaders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.pa_leaders FROM anon, authenticated;
GRANT SELECT ON public.pa_leaders TO authenticated;
DROP POLICY IF EXISTS pa_own_membership ON public.pa_leaders;
CREATE POLICY pa_own_membership ON public.pa_leaders FOR SELECT TO authenticated USING (user_id=(SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.pa_questions_valid(questions JSONB)
RETURNS BOOLEAN LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE q JSONB;
BEGIN
  IF questions IS NULL OR jsonb_typeof(questions)<>'array' THEN RETURN false; END IF;
  IF jsonb_array_length(questions)>20 THEN RETURN false; END IF;
  FOR q IN SELECT value FROM jsonb_array_elements(questions) LOOP
    IF jsonb_typeof(q)<>'object' OR jsonb_typeof(q->'prompt') IS DISTINCT FROM 'string'
      OR char_length(btrim(q->>'prompt')) NOT BETWEEN 1 AND 1500
      OR jsonb_typeof(q->'kind') IS DISTINCT FROM 'string'
      OR q->>'kind' NOT IN ('Observasi','Pemahaman','Penerapan','Diskusi')
      OR q - 'prompt' - 'kind' <> '{}'::jsonb THEN RETURN false; END IF;
  END LOOP;
  RETURN true;
END;
$$;
CREATE TABLE IF NOT EXISTS public.pa_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 160),
  reference TEXT NOT NULL CHECK (char_length(btrim(reference)) BETWEEN 1 AND 160),
  leader_name TEXT NOT NULL CHECK (char_length(btrim(leader_name)) BETWEEN 1 AND 100),
  starts_at TIMESTAMPTZ NOT NULL CHECK (extract(isodow FROM starts_at AT TIME ZONE 'Asia/Makassar')=2),
  questions JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (public.pa_questions_valid(questions)),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (status='draft' OR jsonb_array_length(questions)>0)
);
CREATE INDEX IF NOT EXISTS pa_sessions_schedule ON public.pa_sessions(status,starts_at);
CREATE INDEX IF NOT EXISTS pa_sessions_owner ON public.pa_sessions(created_by);
ALTER TABLE public.pa_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.pa_sessions FROM anon, authenticated;
GRANT SELECT ON public.pa_sessions TO anon, authenticated;
GRANT INSERT, UPDATE ON public.pa_sessions TO authenticated;
DROP POLICY IF EXISTS pa_public_read ON public.pa_sessions;
CREATE POLICY pa_public_read ON public.pa_sessions FOR SELECT TO anon USING (status='published');
DROP POLICY IF EXISTS pa_leader_read ON public.pa_sessions;
CREATE POLICY pa_leader_read ON public.pa_sessions FOR SELECT TO authenticated USING (
  status='published' OR (created_by=(SELECT auth.uid()) AND EXISTS (SELECT 1 FROM public.pa_leaders WHERE user_id=(SELECT auth.uid())))
);
DROP POLICY IF EXISTS pa_leader_insert ON public.pa_sessions;
CREATE POLICY pa_leader_insert ON public.pa_sessions FOR INSERT TO authenticated WITH CHECK (
  created_by=(SELECT auth.uid()) AND EXISTS (SELECT 1 FROM public.pa_leaders WHERE user_id=(SELECT auth.uid()))
);
DROP POLICY IF EXISTS pa_leader_update ON public.pa_sessions;
CREATE POLICY pa_leader_update ON public.pa_sessions FOR UPDATE TO authenticated USING (
  created_by=(SELECT auth.uid()) AND EXISTS (SELECT 1 FROM public.pa_leaders WHERE user_id=(SELECT auth.uid()))
) WITH CHECK (
  created_by=(SELECT auth.uid()) AND EXISTS (SELECT 1 FROM public.pa_leaders WHERE user_id=(SELECT auth.uid()))
);
CREATE OR REPLACE FUNCTION public.pa_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
  NEW.updated_at=clock_timestamp();
  NEW.created_at=OLD.created_at;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS pa_updated_at ON public.pa_sessions;
CREATE TRIGGER pa_updated_at BEFORE UPDATE ON public.pa_sessions FOR EACH ROW EXECUTE FUNCTION public.pa_touch_updated_at();
COMMIT;
