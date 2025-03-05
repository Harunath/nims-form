import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<div>
				<h1 className="text-3xl font-semibold text-gray-800">
					Proforma 1B: Application Form for Initial Review of Biomedical and
					Health research studies
				</h1>
				<p>Fill out the form below to apply</p>
			</div>
			{children}
		</div>
	);
};

export default layout;
