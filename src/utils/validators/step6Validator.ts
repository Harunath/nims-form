import { participantSchema } from "@/lib/validation"; // Adjust path as needed

interface ParticipantInfo {
	id?: string;
	participantType: "HEALTHY" | "PATIENT" | "VULNERABLE" | "OTHER";
	vulnerableJustification?: string;
	safeguards?: string;
	reimbursement: boolean;
	reimbursementDetails?: string;
	advertisement: boolean;
	advertisementDetails?: string;
	applicationId: string;
}

export function step6Validator(data: ParticipantInfo) {
	const result = participantSchema.safeParse(data);
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
