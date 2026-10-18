BEGIN;
CREATE TABLE IF NOT EXISTS private.pa_access_config (
  singleton BOOLEAN PRIMARY KEY DEFAULT true CHECK (singleton),
  code_hash TEXT NOT NULL
);
ALTER TABLE private.pa_access_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.pa_access_config FROM PUBLIC, anon, authenticated;
ALTER TABLE public.pa_sessions ALTER COLUMN created_by DROP NOT NULL;

-- Public RPCs deliberately support leaders without an email account.
-- The shared code is checked on the server on every write, never in browser code.
CREATE OR REPLACE FUNCTION public.pa_check_access(p_code TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE stored_hash TEXT;
BEGIN
  IF p_code IS NULL OR octet_length(p_code) NOT BETWEEN 1 AND 72 THEN RETURN false; END IF;
  SELECT code_hash INTO stored_hash FROM private.pa_access_config WHERE singleton;
  RETURN coalesce(extensions.crypt(p_code,stored_hash)=stored_hash,false);
END;
$$;
CREATE OR REPLACE FUNCTION public.pa_save_with_code(
  p_code TEXT,p_id UUID,p_title TEXT,p_reference TEXT,p_leader_name TEXT,
  p_starts_at TIMESTAMPTZ,p_questions JSONB
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE saved_id UUID;
BEGIN
  IF NOT public.pa_check_access(p_code) THEN
    RAISE EXCEPTION 'Kode pemimpin PA tidak sesuai' USING ERRCODE='42501';
  END IF;
  INSERT INTO public.pa_sessions(id,created_by,title,reference,leader_name,starts_at,questions,status)
  VALUES(coalesce(p_id,gen_random_uuid()),NULL,btrim(p_title),btrim(p_reference),btrim(p_leader_name),p_starts_at,p_questions,'published')
  ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,reference=EXCLUDED.reference,
    leader_name=EXCLUDED.leader_name,starts_at=EXCLUDED.starts_at,questions=EXCLUDED.questions,status='published'
  RETURNING id INTO saved_id;
  RETURN saved_id;
END;
$$;
REVOKE ALL ON FUNCTION public.pa_check_access(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.pa_save_with_code(TEXT,UUID,TEXT,TEXT,TEXT,TIMESTAMPTZ,JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pa_check_access(TEXT) TO anon,authenticated;
GRANT EXECUTE ON FUNCTION public.pa_save_with_code(TEXT,UUID,TEXT,TEXT,TEXT,TIMESTAMPTZ,JSONB) TO anon,authenticated;
COMMIT;
-- Configure the code hash separately in the SQL Editor or trusted management API.
-- Do not commit the shared code or a client-side comparison to the repository.
