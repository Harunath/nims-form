-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "CoInvestigator" DROP CONSTRAINT "CoInvestigator_declarationId_fkey";

-- DropForeignKey
ALTER TABLE "Confidentiality" DROP CONSTRAINT "Confidentiality_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Consent" DROP CONSTRAINT "Consent_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Declaration" DROP CONSTRAINT "Declaration_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Funding" DROP CONSTRAINT "Funding_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Investigator" DROP CONSTRAINT "Investigator_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Methodology" DROP CONSTRAINT "Methodology_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantInfo" DROP CONSTRAINT "ParticipantInfo_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ResearchOverview" DROP CONSTRAINT "ResearchOverview_applicationId_fkey";

-- AddForeignKey
ALTER TABLE "Investigator" ADD CONSTRAINT "Investigator_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchOverview" ADD CONSTRAINT "ResearchOverview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Methodology" ADD CONSTRAINT "Methodology_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantInfo" ADD CONSTRAINT "ParticipantInfo_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confidentiality" ADD CONSTRAINT "Confidentiality_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Declaration" ADD CONSTRAINT "Declaration_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoInvestigator" ADD CONSTRAINT "CoInvestigator_declarationId_fkey" FOREIGN KEY ("declarationId") REFERENCES "Declaration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
