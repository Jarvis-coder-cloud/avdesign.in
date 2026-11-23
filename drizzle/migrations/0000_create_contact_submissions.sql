CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  budget text NOT NULL,
  details text NOT NULL,
  rate_limit_window timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON TABLE public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX contact_submissions_email_window_unique
  ON public.contact_submissions (lower(email), rate_limit_window);