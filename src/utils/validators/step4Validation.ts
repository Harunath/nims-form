import { researchOverviewSchema } from "@/lib/validation"; // Adjust path as needed

interface ResearchOverview {
	id?: string;
	summary: string;
	studyType:
		| "INTERVENTIONAL"
		| "CASE_CONTROL"
		| "COHORT"
		| "RETROSPECTIVE"
		| "EPIDEMIOLOGICAL"
		| "CROSS_SECTIONAL"
		| "SOCIO_BEHAVIORAL"
		| "BIOLOGICAL";
	applicationId: string;
}

export function step4Validator(data: ResearchOverview) {
	const result = researchOverviewSchema.safeParse(data);

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
