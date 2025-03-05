import { fundingSchema } from "@/lib/validation"; // Adjust path as needed

interface Funding {
	id?: string;
	totalBudget: number;
	fundingType: "SELF" | "INSTITUTIONAL" | "AGENCY";
	fundingAgency?: string;
	applicationId: string;
}

export function step3Validator(data: Funding) {
	const result = fundingSchema.safeParse(data);

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
