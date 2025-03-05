"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";
import { step3Validator } from "@/utils/validators/step3Validator";

interface Funding {
	id?: string;
	totalBudget: number;
	fundingType: "SELF" | "INSTITUTIONAL" | "AGENCY";
	fundingAgency?: string;
	applicationId: string;
}

export default function Step3() {
	const router = useRouter();
	const { applicationId } = useApplicationStore();

	const [funding, setFunding] = useState<Funding | null>(null);
	const [formData, setFormData] = useState<Funding>({
		totalBudget: 0,
		fundingType: "SELF",
		fundingAgency: "",
		applicationId: applicationId || "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing funding data if application ID is available
	useEffect(() => {
		const fetchFunding = async () => {
			if (applicationId) {
				try {
					const res = await fetch(
						`/api/funding?applicationId=${applicationId}`
					);
					if (!res.ok) throw new Error("Failed to fetch funding data");
					const data: Funding = await res.json();
					setFunding(data);
					setFormData(data);
				} catch (err) {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Failed to fetch funding data");
					}
				}
			}
		};

		fetchFunding();
	}, [applicationId]);

	async function saveFunding(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});

		if (!applicationId) {
			setError("No application found. Please start from Step 1.");
			return;
		}

		const fundingData: Funding = { ...formData, applicationId };

		const validationResult = step3Validator(fundingData);
		if (!validationResult.success) {
			setErrors(validationResult.errors || {});
			return;
		}
		console.log("Saving funding data");

		try {
			const res = await fetch("/api/funding", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(fundingData),
			});

			if (!res.ok) {
				throw new Error("Failed to save funding data");
			}

			const savedFunding: Funding = await res.json();
			setFunding(savedFunding);
			router.push(`/applications/new?step=4&applicationId=${applicationId}`);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3: Funding</h2>

			<form onSubmit={saveFunding} className="grid grid-cols-2 gap-4">
				{/* Total Budget */}
				<div className="col-span-2">
					<label className="block text-gray-700 font-medium mb-1">
						Total Budget
					</label>
					<input
						type="number"
						name="totalBudget"
						placeholder="Enter total budget"
						value={formData.totalBudget}
						onChange={(e) =>
							setFormData({ ...formData, totalBudget: Number(e.target.value) })
						}
						className="w-full p-2 border rounded focus:outline-blue-500"
					/>
					{errors.totalBudget && (
						<p className="text-red-500 text-sm mt-1">{errors.totalBudget}</p>
					)}
				</div>

				{/* Funding Type */}
				<div className="col-span-2">
					<label className="block text-gray-700 font-medium mb-1">
						Funding Type
					</label>
					<select
						name="fundingType"
						value={formData.fundingType}
						onChange={(e) =>
							setFormData({
								...formData,
								fundingType: e.target.value as Funding["fundingType"],
							})
						}
						className="w-full p-2 border rounded focus:outline-blue-500"
						required>
						<option value="SELF">Self</option>
						<option value="INSTITUTIONAL">Institutional</option>
						<option value="AGENCY">Agency</option>
					</select>
				</div>

				{/* Funding Agency - Only if Agency is selected */}
				{formData.fundingType === "AGENCY" && (
					<div className="col-span-2">
						<label className="block text-gray-700 font-medium mb-1">
							Funding Agency
						</label>
						<input
							type="text"
							name="fundingAgency"
							placeholder="Enter funding agency name"
							value={formData.fundingAgency}
							onChange={(e) =>
								setFormData({ ...formData, fundingAgency: e.target.value })
							}
							className="w-full p-2 border rounded focus:outline-blue-500"
							required
						/>
						{errors.fundingAgency && (
							<p className="text-red-500 text-sm mt-1">
								{errors.fundingAgency}
							</p>
						)}
					</div>
				)}

				{/* Submit Button */}
				<div className="col-span-2 flex justify-end mt-4">
					<button
						type="submit"
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						{funding ? "Update Funding" : "Save Funding"}
					</button>
				</div>
			</form>

			{/* Error Message */}
			{error && <p className="text-red-500 mt-4">{error}</p>}

			{/* Navigation Buttons */}
			<div className="flex justify-end mt-6">
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=4&applicationId=${applicationId}`
						)
					}
					className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
					{"Save & Next"}
				</button>
			</div>
		</div>
	);
}
