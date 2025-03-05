import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { participantSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = participantSchema.parse(body);

		// Ensure the application exists before adding participant information
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		const participant = await prisma.participantInfo.create({
			data: validatedData,
		});

		return NextResponse.json(participant, { status: 201 });
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
		const participants = await prisma.participantInfo.findMany();
		return NextResponse.json(participants, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch participants" },
			{ status: 500 }
		);
	}
}
