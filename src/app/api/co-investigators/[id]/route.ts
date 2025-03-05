import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { coInvestigatorSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const coInvestigator = await prisma.coInvestigator.findUnique({
			where: { id: params.id },
		});

		if (!coInvestigator) {
			return NextResponse.json(
				{ error: "Co-Investigator entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(coInvestigator, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch co-investigator entry" },
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
		const validatedData = coInvestigatorSchema.partial().parse(body);

		const updatedCoInvestigator = await prisma.coInvestigator.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedCoInvestigator, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update co-investigator entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.coInvestigator.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Co-Investigator entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete co-investigator entry" },
			{ status: 500 }
		);
	}
}
