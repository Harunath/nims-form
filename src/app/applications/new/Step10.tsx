"use client";
import { useState } from "react";
import { useApplicationStore } from "@/lib/store";
import FileUpload from "@/components/Upload";
import { useRouter } from "next/navigation";

export default function Step10() {
	const { applicationId } = useApplicationStore();
	const router = useRouter();
	// ✅ Checklist state (tracks selected files)
	const [filesToUpload, setFilesToUpload] = useState<Record<string, boolean>>({
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
	});

	// ✅ Track uploaded file IDs (Initially empty)
	const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>(
		{}
	);

	// ✅ Handle File Selection (Toggle Required)
	function handleFileSelection(fileType: string) {
		setFilesToUpload((prev) => ({
			...prev,
			[fileType]: !prev[fileType],
		}));
	}

	// ✅ Handle File Upload Success (Save File ID)
	function handleFileUpload(fileType: string, fileId: string) {
		setUploadedFiles((prev) => ({
			...prev,
			[fileType]: fileId, // ✅ Save only if uploaded
		}));
	}

	// ✅ Handle Final Submit (Only Send Required Fields)
	async function handleFinalSubmit() {
		try {
			// ✅ Prepare checklistData (Only send required fields)
			const checklistData: Record<string, boolean | string> = {
				applicationId: applicationId!,
			};

			Object.keys(filesToUpload).forEach((key) => {
				if (filesToUpload[key]) {
					checklistData[key] = true; // ✅ Mark item as required
					if (uploadedFiles[key]) {
						checklistData[`${key}Id`] = uploadedFiles[key]; // ✅ Store uploaded file ID
					}
				}
			});

			// ✅ Send API request
			const res = await fetch("/api/checklist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(checklistData),
			});

			if (!res.ok) throw new Error("❌ Failed to save checklist");

			console.log("✅ Checklist & File IDs Saved Successfully!");
			router.push(`/applications/new?step=11&applicationId=${applicationId}`);
		} catch (error) {
			console.error("🚨 Error submitting checklist:", error);
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Step 10: Checklist
			</h2>

			<div>
				<h3 className="text-lg font-semibold text-gray-700 mb-4">
					Select Files to Upload
				</h3>
				<div className="grid grid-cols-1 gap-4">
					{Object.keys(filesToUpload).map((fileType) => (
						<div
							key={fileType}
							className="flex items-center justify-between border rounded p-3">
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={filesToUpload[fileType]}
									onChange={() => handleFileSelection(fileType)}
									className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span className="capitalize text-gray-700">
									{fileType.replace(/([A-Z])/g, " $1")}
								</span>
							</label>

							<div className="flex items-center">
								{/* ✅ Show Upload Component if Selected */}
								{filesToUpload[fileType] && !uploadedFiles[fileType] && (
									<FileUpload
										applicationId={applicationId!}
										fileName={fileType}
										onUpload={(fileId) => handleFileUpload(fileType, fileId)}
									/>
								)}

								{/* ✅ Show Success Message */}
								{uploadedFiles[fileType] && (
									<span className="text-green-500 text-xl animate-bounce">
										✅ Uploaded
									</span>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="mt-6 flex justify-end">
					<button
						onClick={handleFinalSubmit}
						className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
						Submit Checklist
					</button>
				</div>
			</div>
		</div>
	);
}
