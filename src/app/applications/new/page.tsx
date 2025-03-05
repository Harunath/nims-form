"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import Summary from "./Summary";
import { useApplicationStore } from "@/lib/store";
import Step10 from "./Step10";

export default function NewApplicationForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const step = Number(searchParams.get("step")) || 1;
	const { applicationId } = useApplicationStore();

	const nextStep = () => {
		if (step < 10)
			router.push(
				`/applications/new?step=${step + 1}&applicationId=${applicationId}`
			);
	};

	const prevStep = () => {
		if (step > 1)
			router.push(
				`/applications/new?step=${step - 1}&applicationId=${applicationId}`
			);
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white shadow-md">
			<ProgressBar />

			{step === 1 && <Step1 />}
			{step === 2 && <Step2 />}
			{step === 3 && <Step3 />}
			{step === 4 && <Step4 />}
			{step === 5 && <Step5 />}
			{step === 6 && <Step6 />}
			{step === 7 && <Step7 />}
			{step === 8 && <Step8 />}
			{step === 9 && <Step9 />}
			{step === 10 && <Step10 />}
			{step === 11 && <Summary />}

			{/* Navigation Buttons */}
			{applicationId && (
				<div className="flex justify-between mt-4">
					{step > 1 && step < 11 ? (
						<button
							onClick={prevStep}
							className="px-4 py-2 bg-gray-300 rounded">
							Back
						</button>
					) : (
						<div />
					)}
					{step <= 10 ? (
						<button
							onClick={nextStep}
							className="px-4 py-2 bg-blue-500 text-white rounded">
							Next
						</button>
					) : null}
				</div>
			)}
		</div>
	);
}
