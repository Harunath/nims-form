import { z } from "zod";

export const applicationSchema = z.object({
	principalInvestigator: z.string().min(3, "PI Name is required"),
	department: z.string().min(3, "Department is required"),
	submissionDate: z.string().datetime(),
	reviewType: z.enum(["EXPEDITED", "FULL_COMMITTEE"]),
	title: z.string().min(3, "Title is required"),
	acronym: z.string().optional(),
	protocolNumber: z.string().min(1, "Protocol Number is required"),
	versionNumber: z.string().min(1, "Version Number is required"),
});

export const investigatorSchema = z.object({
	name: z.string().min(3, "Name is required"),
	designation: z.string().min(3, "Designation is required"),
	qualification: z.string().min(3, "Qualification is required"),
	department: z.string().min(3, "Department is required"),
	institution: z.string().min(3, "Institution is required"),
	address: z.string().min(5, "Address is required"),
	applicationId: z.string().uuid("Invalid application ID"),
});

export const fundingSchema = z.object({
	totalBudget: z.number().positive("Budget must be greater than zero"),
	fundingType: z.enum(["SELF", "INSTITUTIONAL", "AGENCY"]),
	fundingAgency: z.string().optional(), // Only needed for AGENCY type
	applicationId: z.string().uuid("Invalid application ID"),
});

export const researchOverviewSchema = z.object({
	summary: z.string().min(10, "Summary must be at least 10 characters"),
	studyType: z.enum([
		"INTERVENTIONAL",
		"CASE_CONTROL",
		"COHORT",
		"RETROSPECTIVE",
		"EPIDEMIOLOGICAL",
		"CROSS_SECTIONAL",
		"SOCIO_BEHAVIORAL",
		"BIOLOGICAL",
	]),
	applicationId: z.string().uuid("Invalid application ID"),
});

export const methodologySchema = z.object({
	sampleSize: z.number().positive("Sample size must be greater than zero"),
	justification: z
		.string()
		.min(10, "Justification must be at least 10 characters"),
	externalLab: z.boolean(),
	externalLabDetails: z.string().optional(), // Only needed if externalLab is true
	applicationId: z.string().uuid("Invalid application ID"),
});

export const participantSchema = z.object({
	participantType: z.enum(["HEALTHY", "PATIENT", "VULNERABLE", "OTHER"]),
	vulnerableJustification: z.string().optional(), // Only needed for VULNERABLE participants
	safeguards: z.string().optional(),
	reimbursement: z.boolean(),
	reimbursementDetails: z.string().optional(), // Only needed if reimbursement is true
	advertisement: z.boolean(),
	advertisementDetails: z.string().optional(), // Only needed if advertisement is true
	applicationId: z.string().uuid("Invalid application ID"),
});

export const consentSchema = z.object({
	waiverRequested: z.boolean(),
	consentDocumentVersion: z
		.string()
		.min(1, "Consent document version is required"),
	languagesProvided: z
		.array(z.string())
		.nonempty("At least one language must be provided"),
	translationCertificate: z.boolean(),
	understandingTools: z.string().optional(),
	applicationId: z.string().uuid("Invalid application ID"),
});

export const paymentSchema = z.object({
	treatmentFree: z.boolean(),
	compensation: z.boolean(),
	details: z.string().optional(),
	applicationId: z.string().uuid("Invalid application ID"),
});

export const confidentialitySchema = z.object({
	hasIdentifiers: z.boolean(),
	identifierType: z.enum(["ANONYMOUS", "IDENTIFIABLE"]),
	accessControl: z.boolean(),
	storageDetails: z.string().min(10, "Storage details are required"),
	applicationId: z.string().uuid("Invalid application ID"),
});

export const declarationSchema = z.object({
	piName: z.string().min(3, "Principal Investigator Name is required"),
	piSignature: z.string().min(5, "PI Signature is required"),
	piDate: z.string().datetime("Invalid date format"),
	coPiName: z.string().optional(),
	coPiSignature: z.string().optional(),
	coPiDate: z.string().datetime().optional(),
	privacyProtected: z.boolean(),
	compliance: z.boolean(),
	amendmentsReport: z.boolean(),
	accurateRecords: z.boolean(),
	applicationId: z.string().uuid("Invalid application ID"),
});

export const coInvestigatorSchema = z.object({
	name: z.string().min(3, "Co-Investigator Name is required"),
	signature: z.string().min(5, "Signature is required"),
	date: z.string().datetime("Invalid date format"),
	declarationId: z.string().uuid("Invalid declaration ID"),
});

export const checklistSchema = z.object({
	coverLetter: z.boolean(),
	investigatorCV: z.boolean(),
	gcpTraining: z.boolean(),
	ecClearance: z.boolean(),
	mouCollaborators: z.boolean(),
	protocolCopy: z.boolean(),
	participantPISICF: z.boolean(),
	assentForm: z.boolean(),
	waiverConsent: z.boolean(),
	proformaCRF: z.boolean(),
	advertisement: z.boolean(),
	insurance: z.boolean().optional(),
	otherDocuments: z.string().optional(),
	applicationId: z.string().uuid("Invalid application ID"),
});
