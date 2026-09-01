ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.profiles FROM anon;

CREATE POLICY "profiles authenticated self read"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);
