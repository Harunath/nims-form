"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { step2Validator } from "@/utils/validators/step2validator";
import { useApplicationStore } from "@/lib/store";

interface Investigator {
	id?: string;
	name: string;
	designation: string;
	qualification: string;
	department: string;
	institution: string;
	address: string;
	applicationId: string;
}

export default function Step2() {
	const router = useRouter();
	const { applicationId } = useApplicationStore();

	const [investigators, setInvestigators] = useState<Investigator[]>([]);
	const [formData, setFormData] = useState({
		name: "",
		designation: "",
		qualification: "",
		department: "",
		institution: "",
		address: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch existing investigators if applicationId exists
	useEffect(() => {
		const fetchInvestigators = async () => {
			if (applicationId) {
				try {
					const res = await fetch(
						`/api/investigators?applicationId=${applicationId}`
					);
					if (!res.ok) throw new Error("Failed to fetch investigators");
					const data: Investigator[] = await res.json();
					setInvestigators(data);
				} catch (err) {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Failed to fetch investigators");
					}
				}
			}
		};
		fetchInvestigators();
	}, [applicationId]);

	// Save new investigator
	async function saveInvestigator(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setErrors({});

		if (!applicationId) {
			setError("No application found. Please start from Step 1.");
			return;
		}

		const newInvestigator: Investigator = { ...formData, applicationId };
		const validationResult = step2Validator(newInvestigator);
		if (!validationResult.success) {
			setErrors(validationResult.errors || {});
			return;
		}
		try {
			const res = await fetch("/api/investigators", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newInvestigator),
			});

			if (!res.ok) {
				throw new Error("Failed to save investigator");
			}

			const savedInvestigator: Investigator = await res.json();

			// Refresh list with newly added investigator
			setInvestigators((prev) => [...prev, savedInvestigator]);

			setFormData({
				name: "",
				designation: "",
				qualification: "",
				department: "",
				institution: "",
				address: "",
			});
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
			<h2 className="text-xl font-bold">Step 2: Investigators</h2>

			{/* Investigator List */}
			{investigators.length > 0 && (
				<div className="my-4 ">
					<h3 className="text-lg font-semibold">Existing Investigators</h3>
					<ul className="border rounded p-2 space-y-2">
						{investigators.map((investigator) => (
							<li key={investigator.id} className="border-b p-2">
								<p className="font-semibold">{investigator.name}</p>
								<p className="text-sm text-gray-600">
									{investigator.designation}
								</p>
								<p className="text-sm text-gray-600">
									{investigator.institution}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Add Investigator Form */}
			<form onSubmit={saveInvestigator} className="space-y-4">
				<input
					type="text"
					name="name"
					placeholder="Name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					className="w-full p-2 border rounded"
				/>
				{errors.name && <p className="text-red-500">{errors.name}</p>}

				<input
					type="text"
					name="designation"
					placeholder="Designation"
					value={formData.designation}
					onChange={(e) =>
						setFormData({ ...formData, designation: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.designation && (
					<p className="text-red-500">{errors.designation}</p>
				)}

				<input
					type="text"
					name="qualification"
					placeholder="Qualification"
					value={formData.qualification}
					onChange={(e) =>
						setFormData({ ...formData, qualification: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.qualification && (
					<p className="text-red-500">{errors.qualification}</p>
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
					type="text"
					name="institution"
					placeholder="Institution"
					value={formData.institution}
					onChange={(e) =>
						setFormData({ ...formData, institution: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.institution && (
					<p className="text-red-500">{errors.institution}</p>
				)}

				<input
					type="text"
					name="address"
					placeholder="Address"
					value={formData.address}
					onChange={(e) =>
						setFormData({ ...formData, address: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				{errors.address && <p className="text-red-500">{errors.address}</p>}

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded">
					Add Investigator
				</button>
			</form>

			{error && <p className="text-red-500">{error}</p>}

			{/* Navigation */}
			{investigators.length > 0 && (
				<div className="flex justify-between mt-4">
					<button
						onClick={() =>
							router.push(
								`/applications/new?step=3&applicationId=${applicationId}`
							)
						}
						className="px-4 py-2 bg-blue-500 text-white rounded">
						Next
					</button>
				</div>
			)}
		</div>
	);
}
