"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";
import {
	step9Validator1,
	step9Validator2,
} from "@/utils/validators/step9Validator";

interface Declaration {
	id?: string;
	piName: string;
	piSignature: string;
	piDate: string;
	coPiName?: string;
	coPiSignature?: string;
	coPiDate?: string;
	privacyProtected: boolean;
	compliance: boolean;
	amendmentsReport: boolean;
	accurateRecords: boolean;
	applicationId: string;
}

interface Checklist {
	id?: string;
	coverLetter: boolean;
	investigatorCV: boolean;
	gcpTraining: boolean;
	ecClearance: boolean;
	mouCollaborators: boolean;
	protocolCopy: boolean;
	participantPISICF: boolean;
	assentForm: boolean;
	waiverConsent: boolean;
	proformaCRF: boolean;
	advertisement: boolean;
	insurance?: boolean;
	otherDocuments?: string;
	applicationId: string;
}

export default function Step9() {
	const router = useRouter();
	const { applicationId } = useApplicationStore(); // Zustand store

	const [declaration, setDeclaration] = useState<Declaration | null>(null);
	const [checklist, setChecklist] = useState<Checklist | null>(null);
	const [formData, setFormData] = useState({
		// Declaration
		piName: "",
		piSignature: "",
		piDate: "",
		coPiName: "",
		coPiSignature: "",
		coPiDate: "",
		privacyProtected: false,
		compliance: false,
		amendmentsReport: false,
		accurateRecords: false,
		// Checklist
		coverLetter: false,
		investigatorCV: false,
		gcpTraining: false,
		ecClearance: false,
		mouCollaborators: false,
		protocolCopy: false,
		participantPISICF: false,
		assentForm: false,
		waiverConsent: false,
		proformaCRF: false,
		advertisement: false,
		insurance: false,
		otherDocuments: "",
		applicationId: applicationId || "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing data if applicationId exists
	useEffect(() => {
		const fetchData = async () => {
			if (!applicationId) return;
			try {
				console.log(`Fetching data for applicationId: ${applicationId}`);

				const [declarationRes, checklistRes] = await Promise.all([
					fetch(`/api/declaration?applicationId=${applicationId}`),
					fetch(`/api/checklist?applicationId=${applicationId}`),
				]);

				if (declarationRes.ok) {
					const declarationData: Declaration = await declarationRes.json();
					setDeclaration(declarationData);
					setFormData((prev) => ({ ...prev, ...declarationData }));
				} else {
					console.warn("No existing declaration found.");
				}

				if (checklistRes.ok) {
					const checklistData: Checklist = await checklistRes.json();
					setChecklist(checklistData);
					setFormData((prev) => ({ ...prev, ...checklistData }));
				} else {
					console.warn("No existing checklist found.");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to fetch data");
			}
		};

		fetchData();
	}, [applicationId]);

	async function saveData(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});

		// Convert date fields properly
		const declarationData = {
			...formData,
			piDate: formData.piDate ? new Date(formData.piDate).toISOString() : "",
			coPiDate: formData.coPiDate
				? new Date(formData.coPiDate).toISOString()
				: undefined,
		};

		const checklistData = { ...formData };

		const declarationValidation = step9Validator1(declarationData);
		const checklistValidation = step9Validator2(checklistData);

		if (!declarationValidation.success || !checklistValidation.success) {
			setErrors({
				...declarationValidation.errors,
				...checklistValidation.errors,
			});
			return;
		}

		try {
			const res1 = await fetch("/api/declaration", {
				method: declaration ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(declarationValidation.data),
			});

			if (!res1.ok) {
				console.error("Failed to save declaration:", await res1.text());
			}

			const res2 = await fetch("/api/checklist", {
				method: checklist ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(checklistValidation.data),
			});

			if (!res2.ok) {
				console.error("Failed to save checklist:", await res2.text());
			}

			router.push(`/applications/summary`);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An error occurred while saving."
			);
		}
	}

	return (
		<div>
			<h2 className="text-xl font-bold">Step 9: Declaration & Checklist</h2>

			{/* Existing Declaration */}
			{declaration && (
				<div className="border p-3 rounded bg-gray-100">
					<h3 className="text-lg font-semibold">Existing Declaration</h3>
					<p>
						<strong>PI Name:</strong> {declaration.piName}
					</p>
					<p>
						<strong>Privacy Protected:</strong>{" "}
						{declaration.privacyProtected ? "Yes" : "No"}
					</p>
				</div>
			)}

			{/* Existing Checklist */}
			{checklist && (
				<div className="border p-3 rounded bg-gray-100">
					<h3 className="text-lg font-semibold">Existing Checklist</h3>
					<p>
						<strong>Cover Letter:</strong>{" "}
						{checklist.coverLetter ? "Yes" : "No"}
					</p>
					<p>
						<strong>Protocol Copy:</strong>{" "}
						{checklist.protocolCopy ? "Yes" : "No"}
					</p>
				</div>
			)}

			<form onSubmit={saveData} className="space-y-4">
				<h3 className="text-lg font-semibold">Declaration</h3>

				<input
					type="text"
					name="piName"
					placeholder="Principal Investigator Name"
					value={formData.piName}
					onChange={(e) => setFormData({ ...formData, piName: e.target.value })}
					className="w-full p-2 border rounded"
					required
				/>
				{errors.piName && <p className="text-red-500">{errors.piName}</p>}

				<label className="flex items-center">
					<input
						type="checkbox"
						checked={formData.privacyProtected}
						onChange={(e) =>
							setFormData({ ...formData, privacyProtected: e.target.checked })
						}
						className="mr-2"
					/>
					Privacy is Protected?
				</label>

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded">
					Save and Continue
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}
