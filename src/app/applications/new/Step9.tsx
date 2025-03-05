"use client";
import { useState, useEffect } from "react";
import { useApplicationStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Step9() {
	const { applicationId } = useApplicationStore(); // ✅ Get applicationId
	const router = useRouter();
	const [declaration, setDeclaration] = useState({
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
	});

	// ✅ Fetch Existing Declaration Data
	useEffect(() => {
		const fetchData = async () => {
			if (!applicationId) return;

			try {
				const res = await fetch(
					`/api/declaration?applicationId=${applicationId}`
				);
				if (res.ok) {
					const data = await res.json();
					setDeclaration(data);
				}
			} catch (error) {
				console.error("Error fetching declaration:", error);
			}
		};

		fetchData();
	}, [applicationId]);

	// ✅ Handle Final Submission
	async function handleSubmit() {
		try {
			const declarationData = {
				applicationId,
				...declaration,
				piDate: declaration.piDate
					? new Date(declaration.piDate).toISOString()
					: "",
				coPiDate: declaration.coPiDate
					? new Date(declaration.coPiDate).toISOString()
					: undefined,
			};

			const res = await fetch("/api/declaration", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(declarationData),
			});

			if (!res.ok) throw new Error("Failed to save declaration");

			console.log("✅ Declaration Saved Successfully!");
			router.push(`/applications/new?step=10&applicationId=${applicationId}`);
		} catch (error) {
			console.error("🚨 Error submitting declaration:", error);
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Step 9: Declaration
			</h2>

			<div className="grid grid-cols-1 gap-6">
				{/* PI Information */}
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Principal Investigator Information
					</h3>
					<input
						type="text"
						name="piName"
						placeholder="Principal Investigator Name"
						value={declaration.piName}
						onChange={(e) =>
							setDeclaration({ ...declaration, piName: e.target.value })
						}
						className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200"
						required
					/>
					<input
						type="text"
						name="piSignature"
						placeholder="Principal Investigator Signature"
						value={declaration.piSignature}
						onChange={(e) =>
							setDeclaration({ ...declaration, piSignature: e.target.value })
						}
						className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200 mt-2"
						required
					/>
					<input
						type="date"
						name="piDate"
						value={declaration.piDate}
						onChange={(e) =>
							setDeclaration({ ...declaration, piDate: e.target.value })
						}
						className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200 mt-2"
						required
					/>
				</div>

				{/* Co-PI Section */}
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Co-Principal Investigator Information (Optional)
					</h3>
					<input
						type="text"
						name="coPiName"
						placeholder="Co-Principal Investigator Name"
						value={declaration.coPiName}
						onChange={(e) =>
							setDeclaration({ ...declaration, coPiName: e.target.value })
						}
						className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200"
					/>
					<input
						type="text"
						name="coPiSignature"
						placeholder="Co-Principal Investigator Signature"
						value={declaration.coPiSignature}
						onChange={(e) =>
							setDeclaration({ ...declaration, coPiSignature: e.target.value })
						}
						className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200 mt-2"
					/>
					<input
						type="date"
						name="coPiDate"
						value={declaration.coPiDate}
						onChange={(e) =>
							setDeclaration({ ...declaration, coPiDate: e.target.value })
						}
						className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200 mt-2"
					/>
				</div>

				{/* Privacy & Compliance */}
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Privacy & Compliance
					</h3>
					<label className="flex items-center mb-2">
						<input
							type="checkbox"
							checked={declaration.privacyProtected}
							onChange={(e) =>
								setDeclaration({
									...declaration,
									privacyProtected: e.target.checked,
								})
							}
							className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span className="text-gray-700">Privacy is Protected?</span>
					</label>
					<label className="flex items-center mb-2">
						<input
							type="checkbox"
							checked={declaration.compliance}
							onChange={(e) =>
								setDeclaration({ ...declaration, compliance: e.target.checked })
							}
							className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span className="text-gray-700">Compliance with Guidelines?</span>
					</label>
				</div>

				{/* Amendments Report & Accurate Records */}
				<div>
					<h3 className="text-lg font-semibold text-gray-700 mb-4">
						Amendments & Records
					</h3>
					<label className="flex items-center mb-2">
						<input
							type="checkbox"
							checked={declaration.amendmentsReport}
							onChange={(e) =>
								setDeclaration({
									...declaration,
									amendmentsReport: e.target.checked,
								})
							}
							className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span className="text-gray-700">
							Will submit amendments report if required?
						</span>
					</label>
					<label className="flex items-center mb-2">
						<input
							type="checkbox"
							checked={declaration.accurateRecords}
							onChange={(e) =>
								setDeclaration({
									...declaration,
									accurateRecords: e.target.checked,
								})
							}
							className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span className="text-gray-700">
							Will maintain accurate records?
						</span>
					</label>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						onClick={handleSubmit}
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						Save & Continue
					</button>
				</div>
			</div>
		</div>
	);
}
