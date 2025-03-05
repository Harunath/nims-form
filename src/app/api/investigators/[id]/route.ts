import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { investigatorSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		console.log("📌 Received applicationId:", params.id);

		// ✅ Use findMany instead of findUnique
		const investigators = await prisma.investigator.findMany({
			where: { applicationId: params.id }, // ✅ Correct query
		});

		if (investigators.length === 0) {
			return NextResponse.json(
				{ error: "No investigators found for this application" },
				{ status: 404 }
			);
		}

		return NextResponse.json(investigators, { status: 200 });
	} catch (error) {
		console.error("🚨 Error fetching investigators:", error);
		return NextResponse.json(
			{ error: "Failed to fetch investigators" },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await req.json();
		const validatedData = investigatorSchema.partial().parse(body);

		const updatedInvestigator = await prisma.investigator.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedInvestigator, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update investigator" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.investigator.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Investigator deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete investigator" },
			{ status: 500 }
		);
	}
}
