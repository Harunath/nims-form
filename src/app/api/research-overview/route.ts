import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { researchOverviewSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = researchOverviewSchema.parse(body);

		// Ensure the application exists before adding research overview
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		const researchOverview = await prisma.researchOverview.create({
			data: validatedData,
		});

		return NextResponse.json(researchOverview, { status: 201 });
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
		const researchOverviews = await prisma.researchOverview.findMany();
		return NextResponse.json(researchOverviews, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch research overviews" },
			{ status: 500 }
		);
	}
}
