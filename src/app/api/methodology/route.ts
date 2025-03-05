import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { methodologySchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = methodologySchema.parse(body);

		// Ensure the application exists before adding methodology
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		const methodology = await prisma.methodology.create({
			data: validatedData,
		});

		return NextResponse.json(methodology, { status: 201 });
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
		const methodologies = await prisma.methodology.findMany();
		return NextResponse.json(methodologies, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch methodologies" },
			{ status: 500 }
		);
	}
}
