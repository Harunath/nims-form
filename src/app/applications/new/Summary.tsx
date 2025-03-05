"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationStore } from "@/lib/store";

interface ApplicationData {
	id?: string;
	principalInvestigator: string;
	department: string;
	submissionDate: string;
	reviewType: string;
	title: string;
	acronym?: string;
	protocolNumber: string;
	versionNumber: string;
}

export default function SummaryPage() {
	const router = useRouter();
	const { applicationId } = useApplicationStore();

	const [application, setApplication] = useState<ApplicationData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [submitted, setSubmitted] = useState<boolean>(false);

	// Fetch the entire application data
	useEffect(() => {
		const fetchApplication = async () => {
			if (!applicationId) {
				setError("No application found. Please start from Step 1.");
				setLoading(false);
				return;
			}

			try {
				const res = await fetch(`/api/applications/${applicationId}`);
				if (!res.ok) throw new Error("Failed to fetch application data");

				const data: ApplicationData = await res.json();
				setApplication(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Failed to load application data.");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchApplication();
	}, [applicationId]);

	async function submitFinalApplication() {
		if (!applicationId) return;

		try {
			const res = await fetch(`/api/applications/${applicationId}/submit`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) throw new Error("Failed to submit application");

			setSubmitted(true);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Error submitting application.");
			}
		}
	}

	if (loading) return <p>Loading application data...</p>;

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div>
			<h2 className="text-xl font-bold">Application Summary</h2>

			{submitted ? (
				<p className="text-green-500 text-lg font-semibold">
					🎉 Your application has been successfully submitted!
				</p>
			) : (
				<>
					<div className="bg-gray-100 p-4 rounded mt-4">
						<h3 className="text-lg font-semibold">Application Details</h3>
						<p>
							<strong>Principal Investigator:</strong>{" "}
							{application?.principalInvestigator}
						</p>
						<p>
							<strong>Department:</strong> {application?.department}
						</p>
						<p>
							<strong>Submission Date:</strong> {application?.submissionDate}
						</p>
						<p>
							<strong>Review Type:</strong> {application?.reviewType}
						</p>
						<p>
							<strong>Title:</strong> {application?.title}
						</p>
						<p>
							<strong>Protocol Number:</strong> {application?.protocolNumber}
						</p>
						<p>
							<strong>Version Number:</strong> {application?.versionNumber}
						</p>
					</div>

					<div className="flex justify-between mt-4">
						<button
							onClick={() =>
								router.push(
									`${
										submitted
											? "/applications"
											: `/applications/new?step=11&applicationId=${applicationId}`
									}`
								)
							}
							className="px-4 py-2 bg-gray-300 rounded">
							Back to applications
						</button>
						<button
							onClick={submitFinalApplication}
							className="px-4 py-2 bg-green-500 text-white rounded">
							Submit Application
						</button>
					</div>
				</>
			)}
		</div>
	);
}
