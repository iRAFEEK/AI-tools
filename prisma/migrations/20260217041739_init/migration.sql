-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FREE', 'FREEMIUM', 'PAID', 'SUBSCRIPTION', 'OPEN_SOURCE');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "websiteUrl" TEXT NOT NULL,
    "logoUrl" TEXT,
    "pricingType" "PricingType" NOT NULL,
    "pricingDetails" TEXT,
    "hasFreeTier" BOOLEAN NOT NULL DEFAULT false,
    "featuredScore" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UseCase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UseCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolCategory" (
    "toolId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ToolCategory_pkey" PRIMARY KEY ("toolId","categoryId")
);

-- CreateTable
CREATE TABLE "ToolTag" (
    "toolId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ToolTag_pkey" PRIMARY KEY ("toolId","tagId")
);

-- CreateTable
CREATE TABLE "ToolFeature" (
    "toolId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "ToolFeature_pkey" PRIMARY KEY ("toolId","featureId")
);

-- CreateTable
CREATE TABLE "ToolUseCase" (
    "toolId" TEXT NOT NULL,
    "useCaseId" TEXT NOT NULL,

    CONSTRAINT "ToolUseCase_pkey" PRIMARY KEY ("toolId","useCaseId")
);

-- CreateTable
CREATE TABLE "ToolTechStack" (
    "toolId" TEXT NOT NULL,
    "techStackId" TEXT NOT NULL,

    CONSTRAINT "ToolTechStack_pkey" PRIMARY KEY ("toolId","techStackId")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pros" TEXT,
    "cons" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isReported" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "logoUrl" TEXT,
    "pricingType" "PricingType" NOT NULL,
    "pricingDetails" TEXT,
    "suggestedCategories" TEXT[],
    "suggestedTags" TEXT[],
    "suggestedFeatures" TEXT[],
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingFormResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "projectType" TEXT NOT NULL,
    "techStack" TEXT[],
    "budget" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "primaryGoal" TEXT NOT NULL,
    "specificFeatures" TEXT[],
    "resultsGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchingFormResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolMatchingScore" (
    "id" TEXT NOT NULL,
    "formResultId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "matchReasons" TEXT[],

    CONSTRAINT "ToolMatchingScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");

-- CreateIndex
CREATE INDEX "Tool_slug_idx" ON "Tool"("slug");

-- CreateIndex
CREATE INDEX "Tool_pricingType_idx" ON "Tool"("pricingType");

-- CreateIndex
CREATE INDEX "Tool_averageRating_idx" ON "Tool"("averageRating");

-- CreateIndex
CREATE INDEX "Tool_featuredScore_idx" ON "Tool"("featuredScore");

-- CreateIndex
CREATE INDEX "Tool_createdAt_idx" ON "Tool"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_key" ON "Feature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_slug_key" ON "Feature"("slug");

-- CreateIndex
CREATE INDEX "Feature_slug_idx" ON "Feature"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UseCase_name_key" ON "UseCase"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UseCase_slug_key" ON "UseCase"("slug");

-- CreateIndex
CREATE INDEX "UseCase_slug_idx" ON "UseCase"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TechStack_name_key" ON "TechStack"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechStack_slug_key" ON "TechStack"("slug");

-- CreateIndex
CREATE INDEX "TechStack_slug_idx" ON "TechStack"("slug");

-- CreateIndex
CREATE INDEX "ToolCategory_categoryId_idx" ON "ToolCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ToolTag_tagId_idx" ON "ToolTag"("tagId");

-- CreateIndex
CREATE INDEX "ToolFeature_featureId_idx" ON "ToolFeature"("featureId");

-- CreateIndex
CREATE INDEX "ToolUseCase_useCaseId_idx" ON "ToolUseCase"("useCaseId");

-- CreateIndex
CREATE INDEX "ToolTechStack_techStackId_idx" ON "ToolTechStack"("techStackId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_toolId_idx" ON "Favorite"("toolId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_toolId_key" ON "Favorite"("userId", "toolId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_toolId_idx" ON "Review"("toolId");

-- CreateIndex
CREATE INDEX "Review_isApproved_idx" ON "Review"("isApproved");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "Rating_userId_idx" ON "Rating"("userId");

-- CreateIndex
CREATE INDEX "Rating_toolId_idx" ON "Rating"("toolId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_toolId_key" ON "Rating"("userId", "toolId");

-- CreateIndex
CREATE INDEX "ToolSubmission_userId_idx" ON "ToolSubmission"("userId");

-- CreateIndex
CREATE INDEX "ToolSubmission_status_idx" ON "ToolSubmission"("status");

-- CreateIndex
CREATE INDEX "ToolSubmission_createdAt_idx" ON "ToolSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "MatchingFormResult_userId_idx" ON "MatchingFormResult"("userId");

-- CreateIndex
CREATE INDEX "MatchingFormResult_createdAt_idx" ON "MatchingFormResult"("createdAt");

-- CreateIndex
CREATE INDEX "ToolMatchingScore_formResultId_idx" ON "ToolMatchingScore"("formResultId");

-- CreateIndex
CREATE INDEX "ToolMatchingScore_score_idx" ON "ToolMatchingScore"("score");

-- CreateIndex
CREATE UNIQUE INDEX "ToolMatchingScore_formResultId_toolId_key" ON "ToolMatchingScore"("formResultId", "toolId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolCategory" ADD CONSTRAINT "ToolCategory_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolCategory" ADD CONSTRAINT "ToolCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTag" ADD CONSTRAINT "ToolTag_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTag" ADD CONSTRAINT "ToolTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolFeature" ADD CONSTRAINT "ToolFeature_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolFeature" ADD CONSTRAINT "ToolFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolUseCase" ADD CONSTRAINT "ToolUseCase_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolUseCase" ADD CONSTRAINT "ToolUseCase_useCaseId_fkey" FOREIGN KEY ("useCaseId") REFERENCES "UseCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTechStack" ADD CONSTRAINT "ToolTechStack_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTechStack" ADD CONSTRAINT "ToolTechStack_techStackId_fkey" FOREIGN KEY ("techStackId") REFERENCES "TechStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolSubmission" ADD CONSTRAINT "ToolSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingFormResult" ADD CONSTRAINT "MatchingFormResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolMatchingScore" ADD CONSTRAINT "ToolMatchingScore_formResultId_fkey" FOREIGN KEY ("formResultId") REFERENCES "MatchingFormResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolMatchingScore" ADD CONSTRAINT "ToolMatchingScore_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
