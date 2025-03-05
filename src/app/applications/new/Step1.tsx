"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validateStep1Data } from "@/utils/validators/step1Validator";
import { useApplicationStore } from "@/lib/store";

interface Application {
	id?: string;
	principalInvestigator: string;
	department: string;
	submissionDate: string;
	reviewType: "EXPEDITED" | "FULL_COMMITTEE";
	title: string;
	acronym?: string;
	protocolNumber: string;
	versionNumber: string;
}

export default function Step1() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { setApplicationId } = useApplicationStore();
	const applicationId = searchParams.get("applicationId");

	const [application, setApplication] = useState<Application | null>(null);
	const [formData, setFormData] = useState<Application>({
		principalInvestigator: "",
		department: "",
		submissionDate: "",
		reviewType: "EXPEDITED",
		title: "",
		acronym: "",
		protocolNumber: "",
		versionNumber: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing application data if applicationId is available
	useEffect(() => {
		const fetchApplication = async () => {
			if (applicationId) {
				try {
					const res = await fetch(`/api/applications/${applicationId}`);
					if (!res.ok) throw new Error("Failed to fetch application data");

					const data: Application = await res.json();
					setApplicationId(data.id!);
					setApplication(data);
					setFormData(data);
				} catch (err) {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Failed to fetch application data.");
					}
				}
			}
		};

		fetchApplication();
	}, [applicationId]);

	async function saveApplication(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});
		formData.submissionDate = new Date(formData.submissionDate).toISOString();
		const validationResult = validateStep1Data(formData);
		if (!validationResult.success) {
			setErrors(validationResult.errors || {});
			return;
		}

		const method = application ? "PATCH" : "POST";
		const url = application
			? `/api/applications/${applicationId}`
			: "/api/applications";

		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				throw new Error("Failed to save application");
			}

			const savedApplication: Application = await res.json();
			setApplication(savedApplication);
			setApplicationId(savedApplication.id!);
			router.push(
				`/applications/new?step=2&applicationId=${savedApplication.id}`
			);
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
			<h2 className="text-xl font-bold">Step 1: Application Details</h2>
			<form onSubmit={saveApplication} className="space-y-4">
				<input
					type="text"
					name="principalInvestigator"
					placeholder="Principal Investigator"
					value={formData.principalInvestigator}
					onChange={(e) =>
						setFormData({ ...formData, principalInvestigator: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.principalInvestigator && (
					<p className="text-red-500">{errors.principalInvestigator}</p>
				)}

				<input
					type="text"
					name="department"
					placeholder="Department"
					value={formData.department}
					onChange={(e) =>
						setFormData({ ...formData, department: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.department && (
					<p className="text-red-500">{errors.department}</p>
				)}

				<input
					type="date"
					name="submissionDate"
					value={formData.submissionDate}
					onChange={(e) =>
						setFormData({ ...formData, submissionDate: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.submissionDate && (
					<p className="text-red-500">{errors.submissionDate}</p>
				)}

				<select
					name="reviewType"
					value={formData.reviewType}
					onChange={(e) =>
						setFormData({
							...formData,
							reviewType: e.target.value as "EXPEDITED" | "FULL_COMMITTEE",
						})
					}
					className="w-full p-2 border rounded">
					<option value="EXPEDITED">Expedited</option>
					<option value="FULL_COMMITTEE">Full Committee</option>
				</select>

				<input
					type="text"
					name="title"
					placeholder="Title"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					className="w-full p-2 border rounded"
				/>
				{errors.title && <p className="text-red-500">{errors.title}</p>}

				<input
					type="text"
					name="acronym"
					placeholder="Acronym (optional)"
					value={formData.acronym}
					onChange={(e) =>
						setFormData({ ...formData, acronym: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>

				<input
					type="text"
					name="protocolNumber"
					placeholder="Protocol Number"
					value={formData.protocolNumber}
					onChange={(e) =>
						setFormData({ ...formData, protocolNumber: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.protocolNumber && (
					<p className="text-red-500">{errors.protocolNumber}</p>
				)}

				<input
					type="text"
					name="versionNumber"
					placeholder="Version Number"
					value={formData.versionNumber}
					onChange={(e) =>
						setFormData({ ...formData, versionNumber: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.versionNumber && (
					<p className="text-red-500">{errors.versionNumber}</p>
				)}

				<div className="flex justify-end">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded">
						{"save & Next"}
					</button>
				</div>
			</form>

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}
