import { methodologySchema } from "@/lib/validation"; // Adjust path as needed

interface Methodology {
	id?: string;
	sampleSize: number;
	justification: string;
	externalLab: boolean;
	externalLabDetails?: string;
	applicationId: string;
}

export function step5Validator(data: Methodology) {
	const result = methodologySchema.safeParse(data);

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
