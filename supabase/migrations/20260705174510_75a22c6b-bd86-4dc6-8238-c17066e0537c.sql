
CREATE POLICY "Public read all buckets" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('project-images','thumbnails','resume','profile'));

CREATE POLICY "Admins upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('project-images','thumbnails','resume','profile') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('project-images','thumbnails','resume','profile') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('project-images','thumbnails','resume','profile') AND public.has_role(auth.uid(),'admin'));
