import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow-md p-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-semibold text-gray-800 mb-2">
						Proforma 1B: Application Form for Initial Review of Biomedical and
						Health Research Studies
					</h1>
					<p className="text-gray-600">Fill out the form below to apply</p>
				</div>
			</header>
			<main className="max-w-4xl mx-auto p-6">{children}</main>
		</div>
	);
};

export default Layout;
