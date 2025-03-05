"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";
import { step5Validator } from "@/utils/validators/step5Validator";

interface Methodology {
	id?: string;
	sampleSize: number;
	justification: string;
	externalLab: boolean;
	externalLabDetails?: string;
	applicationId: string;
}

export default function Step5() {
	const router = useRouter();
	const { applicationId } = useApplicationStore(); // Get from Zustand
	const [methodology, setMethodology] = useState<Methodology | null>(null);
	const [formData, setFormData] = useState<Methodology>({
		sampleSize: 0,
		justification: "",
		externalLab: false,
		externalLabDetails: "",
		applicationId: applicationId || "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing methodology data if application ID is available
	useEffect(() => {
		const fetchMethodology = async () => {
			if (applicationId) {
				try {
					const res = await fetch(
						`/api/methodology?applicationId=${applicationId}`
					);
					if (!res.ok) throw new Error("Failed to fetch methodology data");
					const data: Methodology = await res.json();
					setMethodology(data);
					setFormData(data);
				} catch (err) {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Failed to fetch methodology data");
					}
				}
			}
		};

		fetchMethodology();
	}, [applicationId]);

	async function saveMethodology(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});
		formData.applicationId = applicationId || "";
		const validationResult = step5Validator(formData);
		if (!validationResult.success) {
			setErrors(validationResult.errors || {});
			return;
		}

		try {
			const res = await fetch("/api/methodology", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				throw new Error("Failed to save methodology data");
			}

			const savedMethodology: Methodology = await res.json();
			setMethodology(savedMethodology);
			router.push(`/applications/new?step=6&applicationId=${applicationId}`);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An error occurred while saving.");
			}
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Step 5: Methodology
			</h2>

			<form onSubmit={saveMethodology} className="grid grid-cols-2 gap-4">
				{/* Sample Size */}
				<div className="col-span-2">
					<label className="block text-gray-700 font-medium mb-1">
						Sample Size
					</label>
					<input
						type="number"
						name="sampleSize"
						placeholder="Enter Sample Size"
						value={formData.sampleSize}
						onChange={(e) =>
							setFormData({ ...formData, sampleSize: Number(e.target.value) })
						}
						className="w-full p-2 border rounded focus:outline-blue-500"
					/>
					{errors.sampleSize && (
						<p className="text-red-500 text-sm mt-1">{errors.sampleSize}</p>
					)}
				</div>

				{/* Justification */}
				<div className="col-span-2">
					<label className="block text-gray-700 font-medium mb-1">
						Justification
					</label>
					<textarea
						name="justification"
						placeholder="Provide Justification"
						value={formData.justification}
						onChange={(e) =>
							setFormData({ ...formData, justification: e.target.value })
						}
						className="w-full p-2 border rounded focus:outline-blue-500"
						rows={4}
						required
					/>
					{errors.justification && (
						<p className="text-red-500 text-sm mt-1">{errors.justification}</p>
					)}
				</div>

				{/* External Lab Checkbox */}
				<div className="col-span-2">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={formData.externalLab}
							onChange={(e) =>
								setFormData({ ...formData, externalLab: e.target.checked })
							}
							className="mr-2 w-4 h-4"
						/>
						<span className="text-gray-700">External Lab Required?</span>
					</label>
				</div>

				{/* External Lab Details */}
				{formData.externalLab && (
					<div className="col-span-2">
						<label className="block text-gray-700 font-medium mb-1">
							External Lab Details
						</label>
						<input
							type="text"
							name="externalLabDetails"
							placeholder="Provide External Lab Details"
							value={formData.externalLabDetails}
							onChange={(e) =>
								setFormData({ ...formData, externalLabDetails: e.target.value })
							}
							className="w-full p-2 border rounded focus:outline-blue-500"
							required
						/>
						{errors.externalLabDetails && (
							<p className="text-red-500 text-sm mt-1">
								{errors.externalLabDetails}
							</p>
						)}
					</div>
				)}

				{/* Submit Button */}
				<div className="col-span-2 flex justify-end mt-4">
					<button
						type="submit"
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						{methodology ? "Update Methodology" : "Save Methodology"}
					</button>
				</div>
			</form>

			{/* Error Message */}
			{error && <p className="text-red-500 mt-4">{error}</p>}
		</div>
	);
}
