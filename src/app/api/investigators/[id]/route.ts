import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { investigatorSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const investigator = await prisma.investigator.findUnique({
			where: { id: params.id },
		});

		if (!investigator) {
			return NextResponse.json(
				{ error: "Investigator not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(investigator, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch investigator" },
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
