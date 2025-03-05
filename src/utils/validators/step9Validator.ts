import { z } from "zod";
import { checklistSchema } from "@/lib/validation"; // ✅ Import Checklist Schema

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
	applicationId: string;

	// ✅ Boolean flags for required documents
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

	// ✅ File IDs (Stored in PostgreSQL, referenced from MongoDB)
	coverLetterId?: string;
	investigatorCVID?: string;
	gcpTrainingId?: string;
	ecClearanceId?: string;
	mouCollaboratorsId?: string;
	protocolCopyId?: string;
	participantPISICFId?: string;
	assentFormId?: string;
	waiverConsentId?: string;
	proformaCRFId?: string;
	advertisementId?: string;
	insuranceId?: string;
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

export function step9Validator2(data: Checklist) {
	const result = checklistSchema.safeParse(data);
	console.log(result);
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
