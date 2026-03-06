/*
  Warnings:

  - Added the required column `name` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `avatars` table without a default value. This is not possible if the table is not empty.

*/
BEGIN;
  -- AlterTable
  ALTER TABLE "avatars" 
  ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN     "deleted_at" TIMESTAMP(3),
  ADD COLUMN     "name" TEXT NOT NULL,
  ADD COLUMN     "profile_id" CHAR(36) NOT NULL,
  ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

  -- AddForeignKey
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;