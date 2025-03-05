import { consentSchema } from "@/lib/validation"; // Adjust path as needed

interface Consent {
	id?: string;
	waiverRequested: boolean;
	consentDocumentVersion: string;
	languagesProvided: string[];
	translationCertificate: boolean;
	understandingTools?: string;
	applicationId: string;
}

export function step7Validator(data: Consent) {
	const result = consentSchema.safeParse(data);

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
