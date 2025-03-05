"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";
import { step4Validator } from "@/utils/validators/step4Validation";

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

export default function Step4() {
	const router = useRouter();
	const { applicationId } = useApplicationStore();

	const [researchOverview, setResearchOverview] =
		useState<ResearchOverview | null>(null);
	const [formData, setFormData] = useState<ResearchOverview>({
		summary: "",
		studyType: "INTERVENTIONAL",
		applicationId: applicationId || "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing research overview if application ID is available
	useEffect(() => {
		const fetchResearchOverview = async () => {
			if (applicationId) {
				try {
					const res = await fetch(
						`/api/research-overview?applicationId=${applicationId}`
					);
					if (!res.ok) throw new Error("Failed to fetch research overview");
					const data: ResearchOverview = await res.json();
					setResearchOverview(data);
					setFormData(data);
				} catch (err) {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Failed to fetch research overview");
					}
					setError("Failed to fetch research overview");
				}
			}
		};

		fetchResearchOverview();
	}, [applicationId]);

	async function saveResearchOverview(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});

		if (!applicationId) {
			setError("No application found. Please start from Step 1.");
			return;
		}

		const researchOverviewData: ResearchOverview = {
			...formData,
			applicationId,
		};

		const validationResult = step4Validator(researchOverviewData);
		console.log(validationResult);
		if (!validationResult.success) {
			setErrors(validationResult.errors || {});
			return;
		}

		try {
			const res = await fetch("/api/research-overview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(researchOverviewData),
			});

			if (!res.ok) {
				throw new Error("Failed to save research overview");
			}

			const savedResearchOverview: ResearchOverview = await res.json();
			setResearchOverview(savedResearchOverview);
			router.push(`/applications/new?step=5&applicationId=${applicationId}`);
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
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Step 4: Research Overview
			</h2>

			<form onSubmit={saveResearchOverview} className="grid grid-cols-2 gap-4">
				{/* Research Summary */}
				<div className="col-span-2">
					<label className="block text-gray-700 font-medium mb-1">
						Research Summary
					</label>
					<textarea
						name="summary"
						placeholder="Provide a brief summary of your research..."
						value={formData.summary}
						onChange={(e) =>
							setFormData({ ...formData, summary: e.target.value })
						}
						className="w-full p-2 border rounded focus:outline-blue-500"
						rows={4}
						required
					/>
					{errors.summary && (
						<p className="text-red-500 text-sm mt-1">{errors.summary}</p>
					)}
				</div>

				{/* Study Type */}
				<div className="col-span-2">
					<label className="block text-gray-700 font-medium mb-1">
						Study Type
					</label>
					<select
						name="studyType"
						value={formData.studyType}
						onChange={(e) =>
							setFormData({
								...formData,
								studyType: e.target.value as ResearchOverview["studyType"],
							})
						}
						className="w-full p-2 border rounded focus:outline-blue-500"
						required>
						<option value="INTERVENTIONAL">Interventional</option>
						<option value="CASE_CONTROL">Case Control</option>
						<option value="COHORT">Cohort</option>
						<option value="RETROSPECTIVE">Retrospective</option>
						<option value="EPIDEMIOLOGICAL">Epidemiological</option>
						<option value="CROSS_SECTIONAL">Cross Sectional</option>
						<option value="SOCIO_BEHAVIORAL">Socio-Behavioral</option>
						<option value="BIOLOGICAL">Biological</option>
					</select>
				</div>

				{/* Submit Button */}
				<div className="col-span-2 flex justify-end mt-4">
					<button
						type="submit"
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						{researchOverview
							? "Update Research Overview"
							: "Save Research Overview"}
					</button>
				</div>
			</form>

			{/* Error Message */}
			{error && <p className="text-red-500 mt-4">{error}</p>}
		</div>
	);
}
