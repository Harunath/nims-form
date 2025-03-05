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
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Step 6: Participants
			</h2>

			<form onSubmit={saveParticipantInfo} className="grid grid-cols-2 gap-4">
				{/* Participant Type */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Participant Type
					</label>
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
				</div>

				{/* Vulnerable Justification (Conditional) */}
				{formData.participantType === "VULNERABLE" && (
					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Vulnerable Justification
						</label>
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
						{errors.vulnerableJustification && (
							<p className="text-red-500 text-sm">
								{errors.vulnerableJustification}
							</p>
						)}
					</div>
				)}

				{/* Safeguards */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Safeguards
					</label>
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
						<p className="text-red-500 text-sm">{errors.safeguards}</p>
					)}
				</div>

				{/* Reimbursement Provided */}
				<div className="col-span-2">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={formData.reimbursement}
							onChange={(e) =>
								setFormData({ ...formData, reimbursement: e.target.checked })
							}
							className="mr-2"
						/>
						<span className="text-gray-700 font-medium">
							Reimbursement Provided?
						</span>
					</label>
				</div>

				{/* Reimbursement Details (Conditional) */}
				{formData.reimbursement && (
					<div className="col-span-2">
						<input
							type="text"
							name="reimbursementDetails"
							placeholder="Reimbursement Details"
							value={formData.reimbursementDetails}
							onChange={(e) =>
								setFormData({
									...formData,
									reimbursementDetails: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
						{errors.reimbursementDetails && (
							<p className="text-red-500 text-sm">
								{errors.reimbursementDetails}
							</p>
						)}
					</div>
				)}

				{/* Advertisement Used */}
				<div className="col-span-2">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={formData.advertisement}
							onChange={(e) =>
								setFormData({ ...formData, advertisement: e.target.checked })
							}
							className="mr-2"
						/>
						<span className="text-gray-700 font-medium">
							Advertisement Used?
						</span>
					</label>
				</div>

				{/* Advertisement Details (Conditional) */}
				{formData.advertisement && (
					<div className="col-span-2">
						<input
							type="text"
							name="advertisementDetails"
							placeholder="Advertisement Details"
							value={formData.advertisementDetails}
							onChange={(e) =>
								setFormData({
									...formData,
									advertisementDetails: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
						{errors.advertisementDetails && (
							<p className="text-red-500 text-sm">
								{errors.advertisementDetails}
							</p>
						)}
					</div>
				)}

				{/* Submit Button */}
				<div className="col-span-2 flex justify-end">
					<button
						type="submit"
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						{participantInfo
							? "Update Participant Info"
							: "Save Participant Info"}
					</button>
				</div>
			</form>

			{error && <p className="text-red-500 mt-4">{error}</p>}
		</div>
	);
}
