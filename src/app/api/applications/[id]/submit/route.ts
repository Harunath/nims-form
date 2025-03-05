import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const application = await prisma.application.findUnique({
			where: { id: params.id },
			include: {
				investigators: true,
				funding: true,
				researchOverview: true,
				methodology: true,
				participantInfo: true,
				consent: true,
				payment: true,
				confidentiality: true,
				declarations: true,
				checklists: true,
			},
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		// Check if all required sections exist
		const missingSections = [];
		if (!application.investigators.length)
			missingSections.push("Investigators");
		if (!application.funding) missingSections.push("Funding");
		if (!application.researchOverview)
			missingSections.push("Research Overview");
		if (!application.methodology) missingSections.push("Methodology");
		if (!application.participantInfo) missingSections.push("Participants");
		if (!application.consent) missingSections.push("Consent");
		if (!application.payment) missingSections.push("Payment");
		if (!application.confidentiality) missingSections.push("Confidentiality");
		if (!application.declarations) missingSections.push("Declaration");
		if (!application.checklists.length) missingSections.push("Checklist");

		if (missingSections.length > 0) {
			return NextResponse.json(
				{ error: "Cannot submit application", missingSections },
				{ status: 400 }
			);
		}

		// Mark the application as submitted
		const updatedApplication = await prisma.application.update({
			where: { id: params.id },
			data: { status: "SUBMITTED" },
		});

		return NextResponse.json(
			{
				message: "Application submitted successfully",
				application: updatedApplication,
			},
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to submit application" },
			{ status: 500 }
		);
	}
}
