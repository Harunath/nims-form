import { z } from "zod";

interface Payment {
	id?: string;
	treatmentFree: boolean;
	compensation: boolean;
	details?: string;
	applicationId: string;
}

interface Confidentiality {
	id?: string;
	hasIdentifiers: boolean;
	identifierType: "ANONYMOUS" | "IDENTIFIABLE";
	accessControl: boolean;
	storageDetails?: string;
	applicationId: string;
}

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
	storageDetails: z.string().optional(),
	applicationId: z.string().uuid("Invalid application ID"),
});

export function step8Validator1(data: Payment) {
	const result = paymentSchema.safeParse(data);
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

export function step8Validator2(data: Confidentiality) {
	const result = confidentialitySchema.safeParse(data);
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
