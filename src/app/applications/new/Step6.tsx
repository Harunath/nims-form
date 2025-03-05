"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";
import { step6Validator } from "@/utils/validators/step6Validator";

interface ParticipantInfo {
	id?: string;
	participantType: "HEALTHY" | "PATIENT" | "VULNERABLE" | "OTHER";
	vulnerableJustification?: string;
	safeguards?: string;
	reimbursement: boolean;
	reimbursementDetails?: string;
	advertisement: boolean;
	advertisementDetails?: string;
	applicationId: string;
}

export default function Step6() {
	const router = useRouter();
	const { applicationId } = useApplicationStore(); // Get from Zustand
	const [participantInfo, setParticipantInfo] =
		useState<ParticipantInfo | null>(null);
	const [formData, setFormData] = useState<ParticipantInfo>({
		participantType: "HEALTHY",
		vulnerableJustification: "",
		safeguards: "",
		reimbursement: false,
		reimbursementDetails: "",
		advertisement: false,
		advertisementDetails: "",
		applicationId: applicationId || "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing participant data if application ID is available
	useEffect(() => {
		const fetchParticipantInfo = async () => {
			if (applicationId) {
				try {
					const res = await fetch(
						`/api/participants?applicationId=${applicationId}`
					);
					if (!res.ok) throw new Error("Failed to fetch participant info");
					const data: ParticipantInfo = await res.json();
					setParticipantInfo(data);
					setFormData(data);
				} catch (err) {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Failed to fetch participant info");
					}
				}
			}
		};

		fetchParticipantInfo();
	}, [applicationId]);

	async function saveParticipantInfo(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});
		formData.applicationId = applicationId || "";
		const validationResult = step6Validator(formData);
		if (!validationResult.success) {
			setErrors(validationResult.errors || {});
			return;
		}

		try {
			const res = await fetch("/api/participants", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				throw new Error("Failed to save participant info");
			}

			const savedParticipant: ParticipantInfo = await res.json();
			setParticipantInfo(savedParticipant);
			router.push(`/applications/new?step=7&applicationId=${applicationId}`);
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
			<h2 className="text-xl font-bold">Step 6: Participants</h2>

			{/* Participant Form */}
			<form onSubmit={saveParticipantInfo} className="space-y-4">
				<select
					name="participantType"
					value={formData.participantType}
					onChange={(e) =>
						setFormData({
							...formData,
							participantType: e.target
								.value as ParticipantInfo["participantType"],
						})
					}
					className="w-full p-2 border rounded"
					required>
					<option value="HEALTHY">Healthy</option>
					<option value="PATIENT">Patient</option>
					<option value="VULNERABLE">Vulnerable</option>
					<option value="OTHER">Other</option>
				</select>

				{formData.participantType === "VULNERABLE" && (
					<textarea
						name="vulnerableJustification"
						placeholder="Justification for vulnerable participants"
						value={formData.vulnerableJustification}
						onChange={(e) =>
							setFormData({
								...formData,
								vulnerableJustification: e.target.value,
							})
						}
						className="w-full p-2 border rounded"
						rows={3}
						required
					/>
				)}
				{errors.vulnerableJustification && (
					<p className="text-red-500">{errors.vulnerableJustification}</p>
				)}

				<textarea
					name="safeguards"
					placeholder="Safeguards"
					value={formData.safeguards}
					onChange={(e) =>
						setFormData({ ...formData, safeguards: e.target.value })
					}
					className="w-full p-2 border rounded"
					rows={3}
				/>
				{errors.safeguards && (
					<p className="text-red-500">{errors.safeguards}</p>
				)}

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.reimbursement}
						onChange={(e) =>
							setFormData({ ...formData, reimbursement: e.target.checked })
						}
						className="mr-2"
					/>
					Reimbursement Provided?
				</label>

				{formData.reimbursement && (
					<input
						type="text"
						name="reimbursementDetails"
						placeholder="Reimbursement Details"
						value={formData.reimbursementDetails}
						onChange={(e) =>
							setFormData({ ...formData, reimbursementDetails: e.target.value })
						}
						className="w-full p-2 border rounded"
						required
					/>
				)}
				{errors.reimbursementDetails && (
					<p className="text-red-500">{errors.reimbursementDetails}</p>
				)}

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.advertisement}
						onChange={(e) =>
							setFormData({ ...formData, advertisement: e.target.checked })
						}
						className="mr-2"
					/>
					Advertisement Used?
				</label>

				{formData.advertisement && (
					<input
						type="text"
						name="advertisementDetails"
						placeholder="Advertisement Details"
						value={formData.advertisementDetails}
						onChange={(e) =>
							setFormData({ ...formData, advertisementDetails: e.target.value })
						}
						className="w-full p-2 border rounded"
						required
					/>
				)}
				{errors.advertisementDetails && (
					<p className="text-red-500">{errors.advertisementDetails}</p>
				)}

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded">
					{participantInfo
						? "Update Participant Info"
						: "Save Participant Info"}
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}

			{/* Navigation */}
			{/* <div className="flex justify-between mt-4">
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=5&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-gray-300 rounded">
					Back
				</button>
				<button
					onClick={() =>
						router.push(
							`/applications/new?step=7&applicationId=${applicationId}`
						)
					}
					className="px-4 py-2 bg-blue-500 text-white rounded">
					Next
				</button>
			</div> */}
		</div>
	);
}
