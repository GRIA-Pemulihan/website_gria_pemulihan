-- Allow PA guide questions to contain only their prompt text.
-- The optional kind key remains accepted for older saved sessions.
CREATE OR REPLACE FUNCTION public.pa_questions_valid(questions JSONB)
RETURNS BOOLEAN LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE q JSONB;
BEGIN
  IF questions IS NULL OR jsonb_typeof(questions)<>'array' THEN RETURN false; END IF;
  IF jsonb_array_length(questions)>20 THEN RETURN false; END IF;
  FOR q IN SELECT value FROM jsonb_array_elements(questions) LOOP
    IF jsonb_typeof(q)<>'object'
      OR jsonb_typeof(q->'prompt') IS DISTINCT FROM 'string'
      OR char_length(btrim(q->>'prompt')) NOT BETWEEN 1 AND 1500
      OR (q ? 'kind' AND (jsonb_typeof(q->'kind') IS DISTINCT FROM 'string'
        OR q->>'kind' NOT IN ('Observasi','Pemahaman','Penerapan','Diskusi')))
      OR q - 'prompt' - 'kind' <> '{}'::jsonb THEN RETURN false; END IF;
  END LOOP;
  RETURN true;
END;
$$;
