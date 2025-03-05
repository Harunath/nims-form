import { investigatorSchema } from "@/lib/validation"; // Adjust path as needed

interface Investigator {
	id?: string;
	name: string;
	designation: string;
	qualification: string;
	department: string;
	institution: string;
	address: string;
	applicationId: string;
}

export function step2Validator(data: Investigator) {
	const result = investigatorSchema.safeParse(data);

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
