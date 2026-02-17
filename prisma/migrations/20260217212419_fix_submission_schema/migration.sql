/*
  Warnings:

  - You are about to drop the column `suggestedCategories` on the `ToolSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `suggestedFeatures` on the `ToolSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `suggestedTags` on the `ToolSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ToolSubmission" DROP COLUMN "suggestedCategories",
DROP COLUMN "suggestedFeatures",
DROP COLUMN "suggestedTags",
ADD COLUMN     "categoryIds" TEXT[],
ADD COLUMN     "hasFreeTier" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "tagIds" TEXT[];
