import { applicationSchema } from "../../lib/validation"; // Adjust path as needed

interface Application {
	id?: string;
	principalInvestigator: string;
	department: string;
	submissionDate: string;
	reviewType: "EXPEDITED" | "FULL_COMMITTEE";
	title: string;
	acronym?: string;
	protocolNumber: string;
	versionNumber: string;
}

export function validateStep1Data(data: Application) {
	const result = applicationSchema.safeParse(data);

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
