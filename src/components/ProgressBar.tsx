"use client";
import { useSearchParams } from "next/navigation";

export default function ProgressBar() {
	const searchParams = useSearchParams();
	const step = Number(searchParams.get("step")) || 1;
	const totalSteps = 11;
	const progress = (step / totalSteps) * 100;

	return (
		<div className="w-full bg-gray-200 rounded-full h-2.5">
			<div
				className="bg-blue-500 h-2.5 rounded-full transition-all"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
