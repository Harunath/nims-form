"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";
import { step7Validator } from "@/utils/validators/Step7Validator";

interface Consent {
	id?: string;
	waiverRequested: boolean;
	consentDocumentVersion: string;
	languagesProvided: string[];
	translationCertificate: boolean;
	understandingTools?: string;
	applicationId: string;
}

export default function Step7() {
	const router = useRouter();
	const { applicationId } = useApplicationStore(); // Get from Zustand
	const [consent, setConsent] = useState<Consent | null>(null);
	const [formData, setFormData] = useState<Consent>({
		waiverRequested: false,
		consentDocumentVersion: "",
		languagesProvided: [],
		translationCertificate: false,
		understandingTools: "",
		applicationId: applicationId || "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing consent data if application ID is available
	useEffect(() => {
		const fetchConsent = async () => {
			if (applicationId) {
				try {
					const res = await fetch(
						`/api/consent?applicationId=${applicationId}`
					);
					if (!res.ok) throw new Error("Failed to fetch consent data");
					const data: Consent = await res.json();
					setConsent(data);
					setFormData(data);
				} catch (err) {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Failed to fetch consent data");
					}
				}
			}
		};

		fetchConsent();
	}, [applicationId]);

	async function saveConsent(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});
		formData.applicationId =
			applicationId || "c11fd5cd-d60c-4ed9-8f18-281704f8fad8";
		const validationResult = step7Validator(formData);
		console.log(validationResult);
		if (!validationResult.success) {
			setErrors(validationResult.errors || {});
			return;
		}

		try {
			const res = await fetch("/api/consent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				throw new Error("Failed to save consent data");
			}

			const savedConsent: Consent = await res.json();
			setConsent(savedConsent);
			router.push(`/applications/new?step=8&applicationId=${applicationId}`);
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
			<h2 className="text-xl font-bold">Step 7: Consent</h2>

			<form onSubmit={saveConsent} className="space-y-4">
				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.waiverRequested}
						onChange={(e) =>
							setFormData({ ...formData, waiverRequested: e.target.checked })
						}
						className="mr-2"
					/>
					Waiver of Consent Requested?
				</label>

				<input
					type="text"
					name="consentDocumentVersion"
					placeholder="Consent Document Version"
					value={formData.consentDocumentVersion}
					onChange={(e) =>
						setFormData({ ...formData, consentDocumentVersion: e.target.value })
					}
					className="w-full p-2 border rounded"
					required
				/>
				{errors.consentDocumentVersion && (
					<p className="text-red-500">{errors.consentDocumentVersion}</p>
				)}

				<input
					type="text"
					name="languagesProvided"
					placeholder="Languages Provided (comma-separated)"
					value={
						formData.languagesProvided && formData.languagesProvided.join(", ")
					}
					onChange={(e) =>
						setFormData({
							...formData,
							languagesProvided: e.target.value
								.split(",")
								.map((lang) => lang.trim()),
						})
					}
					className="w-full p-2 border rounded"
					required
				/>
				{errors.languagesProvided && (
					<p className="text-red-500">{errors.languagesProvided}</p>
				)}

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.translationCertificate}
						onChange={(e) =>
							setFormData({
								...formData,
								translationCertificate: e.target.checked,
							})
						}
						className="mr-2"
					/>
					Translation Certificate Available?
				</label>

				<textarea
					name="understandingTools"
					placeholder="Understanding Tools (if any)"
					value={formData.understandingTools}
					onChange={(e) =>
						setFormData({ ...formData, understandingTools: e.target.value })
					}
					className="w-full p-2 border rounded"
					rows={3}
				/>
				{errors.understandingTools && (
					<p className="text-red-500">{errors.understandingTools}</p>
				)}

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded">
					{consent ? "Update Consent" : "Save Consent"}
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}

			{/* Navigation */}
			<div className="flex justify-between mt-4">
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=6&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-gray-300 rounded">
					Back
				</button>
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=8&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-blue-500 text-white rounded">
					Next
				</button>
			</div>
		</div>
	);
}
