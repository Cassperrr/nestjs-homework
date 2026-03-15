-- CreateIndex
CREATE INDEX "avatars_profile_id_idx" ON "avatars"("profile_id") WHERE (deleted_at IS NULL);

-- CreateIndex
CREATE INDEX "profiles_age_idx" ON "profiles"("age");
