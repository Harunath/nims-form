import Link from "next/link";

export default function Applications() {
	const applications = [
		{ id: "1", title: "Cancer Research Study", status: "Pending" },
		{ id: "2", title: "COVID-19 Vaccine Trial", status: "Approved" },
		{ id: "3", title: "Mental Health Analysis", status: "Rejected" },
	];

	return (
		<main className="flex flex-col items-center justify-center min-h-screen p-6">
			<div className="bg-white shadow-md rounded-lg p-6 text-center w-full max-w-lg">
				<h1 className="text-2xl font-bold text-gray-800">Applications</h1>
				<p className="text-gray-600 mt-2">
					Manage your research applications below.
				</p>

				{/* ✅ Button to Start a New Application */}
				<Link
					href="/applications/new"
					className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
					+ New Application
				</Link>

				{/* ✅ List of Existing Applications */}
				<ul className="mt-6 space-y-3 text-left">
					{applications.map((app) => (
						<li
							key={app.id}
							className="p-3 bg-gray-50 rounded-md shadow-sm flex justify-between items-center">
							<span className="font-medium">{app.title}</span>
							<span
								className={`text-sm px-2 py-1 rounded-full ${
									app.status === "Approved"
										? "bg-green-200 text-green-800"
										: app.status === "Pending"
										? "bg-yellow-200 text-yellow-800"
										: "bg-red-200 text-red-800"
								}`}>
								{app.status}
							</span>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
