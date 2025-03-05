import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { investigatorSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = investigatorSchema.parse(body);

		// Ensure the application exists before adding an investigator
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		const investigator = await prisma.investigator.create({
			data: validatedData,
		});

		return NextResponse.json(investigator, { status: 201 });
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
		const investigators = await prisma.investigator.findMany();
		return NextResponse.json(investigators, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch investigators" },
			{ status: 500 }
		);
	}
}
