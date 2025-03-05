import { z } from "zod";

interface Declaration {
	id?: string;
	piName: string;
	piSignature: string;
	piDate: string;
	coPiName?: string;
	coPiSignature?: string;
	coPiDate?: string;
	privacyProtected: boolean;
	compliance: boolean;
	amendmentsReport: boolean;
	accurateRecords: boolean;
	applicationId: string;
}

interface Checklist {
	id?: string;
	coverLetter: boolean;
	investigatorCV: boolean;
	gcpTraining: boolean;
	ecClearance: boolean;
	mouCollaborators: boolean;
	protocolCopy: boolean;
	participantPISICF: boolean;
	assentForm: boolean;
	waiverConsent: boolean;
	proformaCRF: boolean;
	advertisement: boolean;
	insurance?: boolean;
	otherDocuments?: string;
	applicationId: string;
}

export const declarationSchema = z.object({
	piName: z.string().min(3, "Principal Investigator Name is required"),
	piSignature: z.string().min(3, "PI Signature is required"),
	piDate: z.string().datetime("Invalid date format"),
	coPiName: z.string().optional(),
	coPiSignature: z.string().optional(),
	coPiDate: z.string().datetime("Invalid date format").optional(),
	privacyProtected: z.boolean(),
	compliance: z.boolean(),
	amendmentsReport: z.boolean(),
	accurateRecords: z.boolean(),
	applicationId: z.string().uuid("Invalid application ID"),
});

export function step9Validator1(data: Declaration) {
	const result = declarationSchema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			errors: Object.fromEntries(
				result.error.errors.map((err) => [err.path.join("."), err.message])
			),
		};
	}

	return { success: true, data: result.data };
}

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

export function step9Validator2(data: Checklist) {
	const result = checklistSchema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			errors: Object.fromEntries(
				result.error.errors.map((err) => [err.path.join("."), err.message])
			),
		};
	}

	return { success: true, data: result.data };
}
