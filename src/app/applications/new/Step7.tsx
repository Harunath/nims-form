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
		formData.applicationId = applicationId || "";
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
		<div className="space-y-6 p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-semibold text-gray-900">Step 7: Consent</h2>

			<form onSubmit={saveConsent} className="space-y-4">
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={formData.waiverRequested}
						onChange={(e) =>
							setFormData({ ...formData, waiverRequested: e.target.checked })
						}
						className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
					/>
					<label className="text-gray-700">Waiver of Consent Requested?</label>
				</div>

				<div>
					<input
						type="text"
						name="consentDocumentVersion"
						placeholder="Consent Document Version"
						value={formData.consentDocumentVersion}
						onChange={(e) =>
							setFormData({
								...formData,
								consentDocumentVersion: e.target.value,
							})
						}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{errors.consentDocumentVersion && (
						<p className="text-sm text-red-500 mt-1">
							{errors.consentDocumentVersion}
						</p>
					)}
				</div>

				<div>
					<input
						type="text"
						name="languagesProvided"
						placeholder="Languages Provided (comma-separated)"
						value={
							formData.languagesProvided &&
							formData.languagesProvided.join(", ")
						}
						onChange={(e) =>
							setFormData({
								...formData,
								languagesProvided: e.target.value
									.split(",")
									.map((lang) => lang.trim()),
							})
						}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					{errors.languagesProvided && (
						<p className="text-sm text-red-500 mt-1">
							{errors.languagesProvided}
						</p>
					)}
				</div>

				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={formData.translationCertificate}
						onChange={(e) =>
							setFormData({
								...formData,
								translationCertificate: e.target.checked,
							})
						}
						className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
					/>
					<label className="text-gray-700">
						Translation Certificate Available?
					</label>
				</div>

				<div>
					<textarea
						name="understandingTools"
						placeholder="Understanding Tools (if any)"
						value={formData.understandingTools}
						onChange={(e) =>
							setFormData({ ...formData, understandingTools: e.target.value })
						}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={3}
					/>
					{errors.understandingTools && (
						<p className="text-sm text-red-500 mt-1">
							{errors.understandingTools}
						</p>
					)}
				</div>

				<button
					type="submit"
					className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
					{consent ? "Update Consent" : "Save Consent"}
				</button>
			</form>

			{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
		</div>
	);
}
