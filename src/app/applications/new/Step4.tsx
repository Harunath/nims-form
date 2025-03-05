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
		<div>
			<h2 className="text-xl font-bold">Step 4: Research Overview</h2>

			<form onSubmit={saveResearchOverview} className="space-y-4">
				<textarea
					name="summary"
					placeholder="Research Summary"
					value={formData.summary}
					onChange={(e) =>
						setFormData({ ...formData, summary: e.target.value })
					}
					className="w-full p-2 border rounded"
					rows={4}
					required
				/>
				{errors.summary && <p className="text-red-500">{errors.summary}</p>}

				<select
					name="studyType"
					value={formData.studyType}
					onChange={(e) =>
						setFormData({
							...formData,
							studyType: e.target.value as ResearchOverview["studyType"],
						})
					}
					className="w-full p-2 border rounded"
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

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded">
					{researchOverview
						? "Update Research Overview"
						: "Save Research Overview"}
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}

			{/* Navigation */}
			{/* <div className="flex justify-between mt-4">
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=3&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-gray-300 rounded">
					Back
				</button>
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=5&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-blue-500 text-white rounded">
					Next
				</button>
			</div> */}
		</div>
	);
}
