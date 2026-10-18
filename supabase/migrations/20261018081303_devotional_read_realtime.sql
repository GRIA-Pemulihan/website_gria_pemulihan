BEGIN;
ALTER TABLE public.devotional_reactions DROP CONSTRAINT devotional_reactions_reaction_check;
ALTER TABLE public.devotional_reactions ADD CONSTRAINT devotional_reactions_reaction_check CHECK(reaction IN ('like','love','read'));

-- Publish only totals, never the per-browser reaction records.
CREATE TABLE public.devotional_stats (
  devotional_date DATE PRIMARY KEY CHECK(devotional_date>=DATE '2026-10-04'),
  like_count BIGINT NOT NULL DEFAULT 0 CHECK(like_count>=0),
  read_count BIGINT NOT NULL DEFAULT 0 CHECK(read_count>=0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.devotional_stats ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.devotional_stats FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.devotional_stats TO anon,authenticated;
CREATE POLICY released_devotional_totals ON public.devotional_stats FOR SELECT TO anon,authenticated
USING ((devotional_date+TIME '06:00') AT TIME ZONE 'Asia/Makassar'<=now());

INSERT INTO public.devotional_stats(devotional_date,like_count,read_count)
SELECT devotional_date,count(*) FILTER(WHERE reaction='like'),count(*) FILTER(WHERE reaction='read')
FROM public.devotional_reactions GROUP BY devotional_date;

CREATE OR REPLACE FUNCTION private.update_devotional_stats()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF TG_OP IN ('DELETE','UPDATE') THEN
    IF OLD.reaction IN ('like','read') THEN
      UPDATE public.devotional_stats SET
        like_count=like_count-CASE WHEN OLD.reaction='like' THEN 1 ELSE 0 END,
        read_count=read_count-CASE WHEN OLD.reaction='read' THEN 1 ELSE 0 END,
        updated_at=clock_timestamp()
      WHERE devotional_date=OLD.devotional_date;
    END IF;
  END IF;
  IF TG_OP IN ('INSERT','UPDATE') THEN
    IF NEW.reaction IN ('like','read') THEN
      INSERT INTO public.devotional_stats(devotional_date,like_count,read_count)
      VALUES(NEW.devotional_date,CASE WHEN NEW.reaction='like' THEN 1 ELSE 0 END,CASE WHEN NEW.reaction='read' THEN 1 ELSE 0 END)
      ON CONFLICT(devotional_date) DO UPDATE SET
        like_count=public.devotional_stats.like_count+EXCLUDED.like_count,
        read_count=public.devotional_stats.read_count+EXCLUDED.read_count,
        updated_at=clock_timestamp();
    END IF;
  END IF;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION private.update_devotional_stats() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER devotional_stats_changed AFTER INSERT OR UPDATE OR DELETE ON public.devotional_reactions
FOR EACH ROW EXECUTE FUNCTION private.update_devotional_stats();

CREATE OR REPLACE FUNCTION public.get_devotional_reactions(p_date DATE,p_device_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  IF p_date IS NULL OR p_date<DATE '2026-10-04'
    OR (p_date+TIME '06:00') AT TIME ZONE 'Asia/Makassar'>now()
    OR p_device_id IS NULL OR char_length(p_device_id) NOT BETWEEN 8 AND 100 THEN
    RAISE EXCEPTION 'Invalid or unreleased devotional';
  END IF;
  RETURN (SELECT jsonb_build_object(
    'counts',jsonb_build_object('like',count(*) FILTER(WHERE reaction='like'),'read',count(*) FILTER(WHERE reaction='read'),'love',count(*) FILTER(WHERE reaction='love')),
    'own',jsonb_build_object('like',coalesce(bool_or(reaction='like' AND device_id=p_device_id),false),'read',coalesce(bool_or(reaction='read' AND device_id=p_device_id),false),'love',coalesce(bool_or(reaction='love' AND device_id=p_device_id),false))
  ) FROM public.devotional_reactions WHERE devotional_date=p_date);
END;
$$;
CREATE OR REPLACE FUNCTION public.set_devotional_reaction(p_date DATE,p_device_id TEXT,p_reaction TEXT,p_active BOOLEAN)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  PERFORM public.get_devotional_reactions(p_date,p_device_id);
  IF p_reaction IS NULL OR p_reaction NOT IN ('like','love','read') OR p_active IS NULL THEN
    RAISE EXCEPTION 'Invalid reaction';
  END IF;
  IF p_reaction='read' AND NOT p_active THEN RAISE EXCEPTION 'Read is a permanent mark'; END IF;
  IF p_active THEN
    INSERT INTO public.devotional_reactions(devotional_date,device_id,reaction)
    VALUES(p_date,p_device_id,p_reaction) ON CONFLICT(devotional_date,device_id,reaction) DO NOTHING;
  ELSE
    DELETE FROM public.devotional_reactions WHERE devotional_date=p_date AND device_id=p_device_id AND reaction=p_reaction;
  END IF;
  RETURN public.get_devotional_reactions(p_date,p_device_id);
END;
$$;
DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='devotional_stats') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.devotional_stats;
  END IF;
END $$;
COMMIT;
