-- GRIA V27. Run in the Supabase SQL Editor; no service-role key is used by the app.
BEGIN;
CREATE TABLE IF NOT EXISTS public.devotional_reactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  devotional_date DATE NOT NULL CHECK (devotional_date >= DATE '2026-10-04'),
  device_id TEXT NOT NULL CHECK (char_length(device_id) BETWEEN 8 AND 100),
  reaction TEXT NOT NULL CHECK (reaction IN ('like','love')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (devotional_date, device_id, reaction)
);
CREATE INDEX IF NOT EXISTS idx_devotional_reactions_date ON public.devotional_reactions(devotional_date);
ALTER TABLE public.devotional_reactions ENABLE ROW LEVEL SECURITY;
-- Remove the bundle's public row access: device tokens must not be enumerable.
DROP POLICY IF EXISTS "Public can read devotional reactions" ON public.devotional_reactions;
DROP POLICY IF EXISTS "Public can add devotional reactions" ON public.devotional_reactions;
DROP POLICY IF EXISTS "Public can remove devotional reactions" ON public.devotional_reactions;
REVOKE ALL ON public.devotional_reactions FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_devotional_reactions(p_date DATE, p_device_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF p_date IS NULL OR p_date < DATE '2026-10-04'
     OR (p_date + TIME '06:00') AT TIME ZONE 'Asia/Makassar' > now()
     OR p_device_id IS NULL OR char_length(p_device_id) NOT BETWEEN 8 AND 100 THEN
    RAISE EXCEPTION 'Invalid or unreleased devotional';
  END IF;
  RETURN (SELECT jsonb_build_object(
    'counts', jsonb_build_object('like', count(*) FILTER (WHERE reaction='like'), 'love', count(*) FILTER (WHERE reaction='love')),
    'own', jsonb_build_object('like', coalesce(bool_or(reaction='like' AND device_id=p_device_id),false), 'love', coalesce(bool_or(reaction='love' AND device_id=p_device_id),false))
  ) FROM public.devotional_reactions WHERE devotional_date=p_date);
END;
$$;
CREATE OR REPLACE FUNCTION public.set_devotional_reaction(p_date DATE, p_device_id TEXT, p_reaction TEXT, p_active BOOLEAN)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM public.get_devotional_reactions(p_date, p_device_id);
  IF p_reaction IS NULL OR p_reaction NOT IN ('like','love') OR p_active IS NULL THEN
    RAISE EXCEPTION 'Invalid reaction';
  END IF;
  IF p_active THEN
    INSERT INTO public.devotional_reactions(devotional_date,device_id,reaction)
    VALUES (p_date,p_device_id,p_reaction) ON CONFLICT (devotional_date,device_id,reaction) DO NOTHING;
  ELSE
    DELETE FROM public.devotional_reactions WHERE devotional_date=p_date AND device_id=p_device_id AND reaction=p_reaction;
  END IF;
  RETURN public.get_devotional_reactions(p_date,p_device_id);
END;
$$;
REVOKE ALL ON FUNCTION public.get_devotional_reactions(DATE,TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_devotional_reaction(DATE,TEXT,TEXT,BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_devotional_reactions(DATE,TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_devotional_reaction(DATE,TEXT,TEXT,BOOLEAN) TO anon, authenticated;
COMMENT ON TABLE public.devotional_reactions IS 'Anonymous reactions; random browser token prevents accidental duplicates. No account-level identity or cross-device deduplication.';
COMMIT;
