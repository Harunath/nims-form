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
		formData.applicationId = applicationId || "";
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
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Step 8: Payment & Confidentiality
			</h2>

			<form onSubmit={saveData} className="grid grid-cols-1 gap-6">
				{/* Payment Section */}
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Payment</h3>

					<div className="flex items-center mb-2">
						<input
							type="checkbox"
							checked={formData.treatmentFree || payment?.treatmentFree}
							onChange={(e) =>
								setFormData({ ...formData, treatmentFree: e.target.checked })
							}
							className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label className="text-gray-700">Treatment is Free?</label>
					</div>

					<div className="flex items-center mb-2">
						<input
							type="checkbox"
							checked={formData.compensation || payment?.compensation}
							onChange={(e) =>
								setFormData({ ...formData, compensation: e.target.checked })
							}
							className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label className="text-gray-700">Compensation Provided?</label>
					</div>

					{formData.compensation && (
						<div className="mt-2">
							<textarea
								name="details"
								placeholder="Compensation Details"
								value={formData.details || payment?.details}
								onChange={(e) =>
									setFormData({ ...formData, details: e.target.value })
								}
								className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200"
								rows={3}
							/>
							{errors.details && (
								<p className="text-red-500 text-sm mt-1">{errors.details}</p>
							)}
						</div>
					)}
				</div>

				{/* Confidentiality Section */}
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Confidentiality
					</h3>

					<div className="flex items-center mb-2">
						<input
							type="checkbox"
							checked={
								formData.hasIdentifiers || confidentiality?.hasIdentifiers
							}
							onChange={(e) =>
								setFormData({ ...formData, hasIdentifiers: e.target.checked })
							}
							className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label className="text-gray-700">
							Contains Identifiable Information?
						</label>
					</div>

					{formData.hasIdentifiers && (
						<div className="mb-2">
							<select
								name="identifierType"
								value={
									formData.identifierType || confidentiality?.identifierType
								}
								onChange={(e) =>
									setFormData({
										...formData,
										identifierType: e.target.value as
											| "ANONYMOUS"
											| "IDENTIFIABLE",
									})
								}
								className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200">
								<option value="ANONYMOUS">Anonymous</option>
								<option value="IDENTIFIABLE">Identifiable</option>
							</select>
						</div>
					)}

					<div>
						<textarea
							name="storageDetails"
							placeholder="Describe how the data will be stored"
							value={formData.storageDetails}
							onChange={(e) =>
								setFormData({
									...formData,
									storageDetails: e.target.value || "",
								})
							}
							className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200"
							rows={3}
						/>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						Save and Continue
					</button>
				</div>
			</form>

			{error && <p className="text-red-500 mt-4">{error}</p>}
		</div>
	);
}
