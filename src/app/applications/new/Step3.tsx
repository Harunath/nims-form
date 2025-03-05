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
		<div>
			<h2 className="text-xl font-bold">Step 3: Funding</h2>

			<form onSubmit={saveFunding} className="space-y-4">
				<input
					type="number"
					name="totalBudget"
					placeholder="Total Budget"
					value={formData.totalBudget}
					onChange={(e) =>
						setFormData({ ...formData, totalBudget: Number(e.target.value) })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.totalBudget && (
					<p className="text-red-500">{errors.totalBudget}</p>
				)}

				<select
					name="fundingType"
					value={formData.fundingType}
					onChange={(e) =>
						setFormData({
							...formData,
							fundingType: e.target.value as Funding["fundingType"],
						})
					}
					className="w-full p-2 border rounded"
					required>
					<option value="SELF">Self</option>
					<option value="INSTITUTIONAL">Institutional</option>
					<option value="AGENCY">Agency</option>
				</select>

				{formData.fundingType === "AGENCY" && (
					<>
						<input
							type="text"
							name="fundingAgency"
							placeholder="Funding Agency"
							value={formData.fundingAgency}
							onChange={(e) =>
								setFormData({ ...formData, fundingAgency: e.target.value })
							}
							className="w-full p-2 border rounded"
							required
						/>
						{errors.fundingAgency && (
							<p className="text-red-500">{errors.fundingAgency}</p>
						)}
					</>
				)}

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
					{funding ? "Update Funding" : "Save Funding"}
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}

			{/* Navigation */}
			{/* <div className="flex justify-between mt-4">
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=2&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-gray-300 rounded">
					Back
				</button>
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=4&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-blue-500 text-white rounded">
					Next
				</button>
			</div> */}
		</div>
	);
}
