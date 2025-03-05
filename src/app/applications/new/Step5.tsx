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
		<div>
			<h2 className="text-xl font-bold">Step 5: Methodology</h2>

			<form onSubmit={saveMethodology} className="space-y-4">
				<input
					type="number"
					name="sampleSize"
					placeholder="Sample Size"
					value={formData.sampleSize}
					onChange={(e) =>
						setFormData({ ...formData, sampleSize: Number(e.target.value) })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.sampleSize && (
					<p className="text-red-500">{errors.sampleSize}</p>
				)}

				<textarea
					name="justification"
					placeholder="Justification"
					value={formData.justification}
					onChange={(e) =>
						setFormData({ ...formData, justification: e.target.value })
					}
					className="w-full p-2 border rounded"
					rows={4}
					required
				/>
				{errors.justification && (
					<p className="text-red-500">{errors.justification}</p>
				)}

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.externalLab}
						onChange={(e) =>
							setFormData({ ...formData, externalLab: e.target.checked })
						}
						className="mr-2"
					/>
					External Lab Required?
				</label>

				{formData.externalLab && (
					<>
						<input
							type="text"
							name="externalLabDetails"
							placeholder="External Lab Details"
							value={formData.externalLabDetails}
							onChange={(e) =>
								setFormData({ ...formData, externalLabDetails: e.target.value })
							}
							className="w-full p-2 border rounded"
							required
						/>
						{errors.externalLabDetails && (
							<p className="text-red-500">{errors.externalLabDetails}</p>
						)}
					</>
				)}

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded">
					{methodology ? "Update Methodology" : "Save Methodology"}
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}
