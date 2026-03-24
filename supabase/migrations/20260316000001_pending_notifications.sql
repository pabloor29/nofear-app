-- 1. Table des notifications en attente
CREATE TABLE IF NOT EXISTS public.pending_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT pending_notifications_product_id_key UNIQUE (product_id)
);

ALTER TABLE public.pending_notifications ENABLE ROW LEVEL SECURITY;

-- 2. Trigger function : planifie ou annule une notification lors d'un changement d'état
CREATE OR REPLACE FUNCTION public.handle_product_state_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_code int;
  v_scheduled_at timestamptz;
BEGIN
  -- Ignorer si l'état n'a pas changé
  IF OLD.state IS NOT DISTINCT FROM NEW.state THEN
    RETURN NEW;
  END IF;

  -- Récupérer le code du dernier état (hors code 99 = création)
  SELECT (entry->>'code')::int INTO v_new_code
  FROM jsonb_array_elements(NEW.state->'history') AS entry
  WHERE (entry->>'code')::int != 99
  ORDER BY (entry->>'date') DESC
  LIMIT 1;

  IF v_new_code IS NULL THEN
    RETURN NEW;
  END IF;

  IF v_new_code = 0 THEN
    -- Porte fermée (Fermé) : annuler la notification en attente
    DELETE FROM public.pending_notifications
    WHERE product_id = NEW.id;

  ELSIF v_new_code = 1 THEN
    -- Porte ouverte (Ouvert) : planifier une notification après le délai configuré
    v_scheduled_at := now() + (NEW.notification_delay::text || ' seconds')::interval;

    INSERT INTO public.pending_notifications (product_id, user_id, scheduled_at)
    VALUES (NEW.id, NEW.user_id, v_scheduled_at)
    ON CONFLICT (product_id)
    DO UPDATE SET scheduled_at = EXCLUDED.scheduled_at;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Trigger sur la table products
DROP TRIGGER IF EXISTS on_product_state_change ON public.products;

CREATE TRIGGER on_product_state_change
  AFTER UPDATE OF state ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_product_state_change();
