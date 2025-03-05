-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('EXPEDITED', 'FULL_COMMITTEE');

-- CreateEnum
CREATE TYPE "FundingType" AS ENUM ('SELF', 'INSTITUTIONAL', 'AGENCY');

-- CreateEnum
CREATE TYPE "StudyType" AS ENUM ('INTERVENTIONAL', 'CASE_CONTROL', 'COHORT', 'RETROSPECTIVE', 'EPIDEMIOLOGICAL', 'CROSS_SECTIONAL', 'SOCIO_BEHAVIORAL', 'BIOLOGICAL');

-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('HEALTHY', 'PATIENT', 'VULNERABLE', 'OTHER');

-- CreateEnum
CREATE TYPE "IdentifierType" AS ENUM ('ANONYMOUS', 'IDENTIFIABLE');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "principalInvestigator" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL,
    "reviewType" "ReviewType" NOT NULL,
    "title" TEXT NOT NULL,
    "acronym" TEXT,
    "protocolNumber" TEXT NOT NULL,
    "versionNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investigator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Investigator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funding" (
    "id" TEXT NOT NULL,
    "totalBudget" DOUBLE PRECISION NOT NULL,
    "fundingType" "FundingType" NOT NULL,
    "fundingAgency" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Funding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchOverview" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "studyType" "StudyType" NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "ResearchOverview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Methodology" (
    "id" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "justification" TEXT NOT NULL,
    "externalLab" BOOLEAN NOT NULL,
    "externalLabDetails" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Methodology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantInfo" (
    "id" TEXT NOT NULL,
    "participantType" "ParticipantType" NOT NULL,
    "vulnerableJustification" TEXT,
    "safeguards" TEXT,
    "reimbursement" BOOLEAN NOT NULL,
    "reimbursementDetails" TEXT,
    "advertisement" BOOLEAN NOT NULL,
    "advertisementDetails" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "ParticipantInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "waiverRequested" BOOLEAN NOT NULL,
    "consentDocumentVersion" TEXT NOT NULL,
    "languagesProvided" TEXT[],
    "translationCertificate" BOOLEAN NOT NULL,
    "understandingTools" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "treatmentFree" BOOLEAN NOT NULL,
    "compensation" BOOLEAN NOT NULL,
    "details" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Confidentiality" (
    "id" TEXT NOT NULL,
    "hasIdentifiers" BOOLEAN NOT NULL,
    "identifierType" "IdentifierType" NOT NULL,
    "accessControl" BOOLEAN NOT NULL,
    "storageDetails" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Confidentiality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Declaration" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "piName" TEXT NOT NULL,
    "piSignature" TEXT NOT NULL,
    "piDate" TIMESTAMP(3) NOT NULL,
    "coPiName" TEXT,
    "coPiSignature" TEXT,
    "coPiDate" TIMESTAMP(3),
    "privacyProtected" BOOLEAN NOT NULL,
    "compliance" BOOLEAN NOT NULL,
    "amendmentsReport" BOOLEAN NOT NULL,
    "accurateRecords" BOOLEAN NOT NULL,

    CONSTRAINT "Declaration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoInvestigator" (
    "id" TEXT NOT NULL,
    "declarationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoInvestigator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "coverLetter" BOOLEAN NOT NULL,
    "investigatorCV" BOOLEAN NOT NULL,
    "gcpTraining" BOOLEAN NOT NULL,
    "ecClearance" BOOLEAN NOT NULL,
    "mouCollaborators" BOOLEAN NOT NULL,
    "protocolCopy" BOOLEAN NOT NULL,
    "participantPISICF" BOOLEAN NOT NULL,
    "assentForm" BOOLEAN NOT NULL,
    "waiverConsent" BOOLEAN NOT NULL,
    "proformaCRF" BOOLEAN NOT NULL,
    "advertisement" BOOLEAN NOT NULL,
    "insurance" BOOLEAN,
    "otherDocuments" TEXT,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Investigator_applicationId_key" ON "Investigator"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Funding_applicationId_key" ON "Funding"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchOverview_applicationId_key" ON "ResearchOverview"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Methodology_applicationId_key" ON "Methodology"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantInfo_applicationId_key" ON "ParticipantInfo"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Consent_applicationId_key" ON "Consent"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_applicationId_key" ON "Payment"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Confidentiality_applicationId_key" ON "Confidentiality"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Declaration_applicationId_key" ON "Declaration"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Checklist_applicationId_key" ON "Checklist"("applicationId");

-- AddForeignKey
ALTER TABLE "Investigator" ADD CONSTRAINT "Investigator_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchOverview" ADD CONSTRAINT "ResearchOverview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Methodology" ADD CONSTRAINT "Methodology_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantInfo" ADD CONSTRAINT "ParticipantInfo_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confidentiality" ADD CONSTRAINT "Confidentiality_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Declaration" ADD CONSTRAINT "Declaration_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoInvestigator" ADD CONSTRAINT "CoInvestigator_declarationId_fkey" FOREIGN KEY ("declarationId") REFERENCES "Declaration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
