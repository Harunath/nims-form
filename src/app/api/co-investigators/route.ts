import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { coInvestigatorSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = coInvestigatorSchema.parse(body);

		// Ensure the declaration exists before adding a co-investigator
		const declaration = await prisma.declaration.findUnique({
			where: { id: validatedData.declarationId },
		});

		if (!declaration) {
			return NextResponse.json(
				{ error: "Declaration not found" },
				{ status: 404 }
			);
		}

		const coInvestigator = await prisma.coInvestigator.create({
			data: validatedData,
		});

		return NextResponse.json(coInvestigator, { status: 201 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Invalid input or declaration ID" },
			{ status: 400 }
		);
	}
}

export async function GET() {
	try {
		const coInvestigators = await prisma.coInvestigator.findMany();
		return NextResponse.json(coInvestigators, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch co-investigators" },
			{ status: 500 }
		);
	}
}
