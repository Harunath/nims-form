"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";
import {
	step8Validator1,
	step8Validator2,
} from "@/utils/validators/step8Validator";

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

export default function Step8() {
	const router = useRouter();
	const { applicationId } = useApplicationStore(); // Get from Zustand
	const [payment, setPayment] = useState<Payment | null>(null);

	const [confidentiality, setConfidentiality] =
		useState<Confidentiality | null>(null);
	const [formData, setFormData] = useState({
		// Payment
		treatmentFree: false,
		compensation: false,
		details: "",
		// Confidentiality
		hasIdentifiers: false,
		identifierType: "ANONYMOUS" as "ANONYMOUS" | "IDENTIFIABLE",
		accessControl: false,
		storageDetails: "",
		applicationId: applicationId || "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing data if applicationId exists
	useEffect(() => {
		const fetchData = async () => {
			if (!applicationId) return;
			try {
				const [paymentRes, confidentialityRes] = await Promise.all([
					fetch(`/api/payment?applicationId=${applicationId}`),
					fetch(`/api/confidentiality?applicationId=${applicationId}`),
				]);

				if (paymentRes.ok) {
					const paymentData: Payment = await paymentRes.json();
					setPayment(paymentData);
					setFormData((prev) => ({ ...prev, ...paymentData }));
				}

				if (confidentialityRes.ok) {
					const confidentialityData: Confidentiality =
						await confidentialityRes.json();
					setConfidentiality(confidentialityData);
					setFormData((prev) => ({ ...prev, ...confidentialityData }));
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to fetch data");
			}
		};

		fetchData();
	}, [applicationId]);

	async function saveData(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});
		formData.applicationId =
			applicationId || "c11fd5cd-d60c-4ed9-8f18-281704f8fad8";
		// Split formData for separate validation
		const paymentData = {
			treatmentFree: formData.treatmentFree,
			compensation: formData.compensation,
			details: formData.details,
			applicationId: formData.applicationId,
		};

		const confidentialityData = {
			hasIdentifiers: formData.hasIdentifiers,
			identifierType: formData.identifierType,
			accessControl: formData.accessControl,
			storageDetails: formData.storageDetails,
			applicationId: formData.applicationId,
		};

		const paymentValidation = step8Validator1(paymentData);
		const confidentialityValidation = step8Validator2(confidentialityData);

		if (!paymentValidation.success || !confidentialityValidation.success) {
			setErrors({
				...paymentValidation.errors,
				...confidentialityValidation.errors,
			});
			return;
		}

		try {
			await fetch("/api/payment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(paymentValidation.data),
			});

			await fetch("/api/confidentiality", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(confidentialityValidation.data),
			});

			router.push(`/applications/new?step=9&applicationId=${applicationId}`);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An error occurred while saving."
			);
		}
	}

	return (
		<div>
			<h2 className="text-xl font-bold">Step 8: Payment & Confidentiality</h2>

			<form onSubmit={saveData} className="space-y-4">
				<h3 className="text-lg font-semibold">Payment</h3>

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.treatmentFree || payment?.treatmentFree}
						onChange={(e) =>
							setFormData({ ...formData, treatmentFree: e.target.checked })
						}
						className="mr-2"
					/>
					Treatment is Free?
				</label>

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.compensation || payment?.compensation}
						onChange={(e) =>
							setFormData({ ...formData, compensation: e.target.checked })
						}
						className="mr-2"
					/>
					Compensation Provided?
				</label>

				{formData.compensation && (
					<textarea
						name="details"
						placeholder="Compensation Details"
						value={formData.details || payment?.details}
						onChange={(e) =>
							setFormData({ ...formData, details: e.target.value })
						}
						className="w-full p-2 border rounded"
						rows={3}
					/>
				)}
				{errors.details && <p className="text-red-500">{errors.details}</p>}

				<h3 className="text-lg font-semibold">Confidentiality</h3>

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.hasIdentifiers || confidentiality?.hasIdentifiers}
						onChange={(e) =>
							setFormData({ ...formData, hasIdentifiers: e.target.checked })
						}
						className="mr-2"
					/>
					Contains Identifiable Information?
				</label>

				{formData.hasIdentifiers && (
					<select
						name="identifierType"
						value={formData.identifierType || confidentiality?.identifierType}
						onChange={(e) =>
							setFormData({
								...formData,
								identifierType: e.target.value as "ANONYMOUS" | "IDENTIFIABLE",
							})
						}
						className="w-full p-2 border rounded">
						<option value="ANONYMOUS">Anonymous</option>
						<option value="IDENTIFIABLE">Identifiable</option>
					</select>
				)}
				<textarea
					name="storageDetails"
					placeholder="Describe how the data will be stored"
					value={formData.storageDetails}
					onChange={(e) =>
						setFormData({ ...formData, storageDetails: e.target.value || "" })
					}
					className="w-full p-2 border rounded"
					rows={3}
				/>

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded">
					Save and Continue
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}
