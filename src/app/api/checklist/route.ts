import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checklistSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = checklistSchema.parse(body);

		// Ensure the application exists before adding a checklist
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		const checklist = await prisma.checklist.create({
			data: validatedData,
		});

		return NextResponse.json(checklist, { status: 201 });
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
		const checklists = await prisma.checklist.findMany();
		return NextResponse.json(checklists, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch checklist data" },
			{ status: 500 }
		);
	}
}
