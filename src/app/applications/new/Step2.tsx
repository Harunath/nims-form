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
					const res = await fetch(`/api/investigators/${applicationId}`);
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
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Step 2: Investigators
			</h2>

			{/* Existing Investigators */}
			{investigators.length > 0 && (
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-gray-800">
						Existing Investigators
					</h3>
					<ul className="border rounded-lg p-4 space-y-2 bg-gray-50">
						{investigators.map((investigator) => (
							<li key={investigator.id} className="border-b p-2">
								<p className="font-semibold text-gray-900">
									{investigator.name}
								</p>
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
			<form onSubmit={saveInvestigator} className="grid grid-cols-2 gap-4">
				{/* Name */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full p-2 border rounded"
					/>
					{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
				</div>

				{/* Designation */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Designation
					</label>
					<input
						type="text"
						name="designation"
						value={formData.designation}
						onChange={(e) =>
							setFormData({ ...formData, designation: e.target.value })
						}
						className="w-full p-2 border rounded"
					/>
					{errors.designation && (
						<p className="text-red-500 text-sm">{errors.designation}</p>
					)}
				</div>

				{/* Qualification */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Qualification
					</label>
					<input
						type="text"
						name="qualification"
						value={formData.qualification}
						onChange={(e) =>
							setFormData({ ...formData, qualification: e.target.value })
						}
						className="w-full p-2 border rounded"
					/>
					{errors.qualification && (
						<p className="text-red-500 text-sm">{errors.qualification}</p>
					)}
				</div>

				{/* Department */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Department
					</label>
					<input
						type="text"
						name="department"
						value={formData.department}
						onChange={(e) =>
							setFormData({ ...formData, department: e.target.value })
						}
						className="w-full p-2 border rounded"
					/>
					{errors.department && (
						<p className="text-red-500 text-sm">{errors.department}</p>
					)}
				</div>

				{/* Institution */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Institution
					</label>
					<input
						type="text"
						name="institution"
						value={formData.institution}
						onChange={(e) =>
							setFormData({ ...formData, institution: e.target.value })
						}
						className="w-full p-2 border rounded"
					/>
					{errors.institution && (
						<p className="text-red-500 text-sm">{errors.institution}</p>
					)}
				</div>

				{/* Address */}
				<div>
					<label className="block text-gray-700 font-medium mb-1">
						Address
					</label>
					<input
						type="text"
						name="address"
						value={formData.address}
						onChange={(e) =>
							setFormData({ ...formData, address: e.target.value })
						}
						className="w-full p-2 border rounded"
					/>
					{errors.address && (
						<p className="text-red-500 text-sm">{errors.address}</p>
					)}
				</div>

				{/* Add Investigator Button */}
				<div className="col-span-2 flex justify-end">
					<button
						type="submit"
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						Add Investigator
					</button>
				</div>
			</form>

			{error && <p className="text-red-500 mt-4">{error}</p>}

			{/* Navigation */}
			{investigators.length > 0 && (
				<div className="flex justify-end mt-6">
					<button
						onClick={() =>
							router.push(
								`/applications/new?step=3&applicationId=${applicationId}`
							)
						}
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						{"Save & Next"}
					</button>
				</div>
			)}
		</div>
	);
}
