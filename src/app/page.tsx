import Link from "next/link";

export default function Home() {
	const fakeLinks = [
		"Research Guidelines",
		"Ethical Review Process",
		"Approved Studies",
		"Investigator Resources",
		"Funding Opportunities",
		"Upcoming Conferences",
		"Regulatory Compliance",
		"Frequently Asked Questions",
	];

	return (
		<main className="flex flex-col items-center justify-center bg-white  p-6">
			<div className="p-6 text-center w-full">
				<h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
				<p className="text-gray-600 mt-2">
					Explore various resources related to biomedical and health research.
				</p>

				{/* ✅ Main Application Link */}
				<Link
					href="/applications"
					className="mt-4 block text-lg font-semibold text-blue-600 hover:underline">
					Proforma 1B: Application Form for Initial Review of Biomedical and
					Health Research Studies
				</Link>

				{/* ✅ Fake Links List */}
				<ul className="mt-6 space-y-3">
					{fakeLinks.map((link, index) => (
						<li key={index}>
							<a
								href="#"
								className="text-gray-700 hover:text-blue-500 transition duration-200">
								{link}
							</a>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
