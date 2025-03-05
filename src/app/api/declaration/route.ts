import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { declarationSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = declarationSchema.parse(body);
		console.log("📌 Validated data declarationSchema:", validatedData);

		// Ensure the application exists before adding a declaration
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		const declaration = await prisma.declaration.create({
			data: validatedData,
		});

		return NextResponse.json(declaration, { status: 201 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Invalid input or application ID" },
			{ status: 400 }
		);
	}
}

export async function GET() {
	try {
		const declarations = await prisma.declaration.findMany();
		return NextResponse.json(declarations, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch declarations" },
			{ status: 500 }
		);
	}
}
