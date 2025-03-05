import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fundingSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = fundingSchema.parse(body);

		// Ensure the application exists before adding funding
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}
		console.log(application);

		const funding = await prisma.funding.create({
			data: validatedData,
		});
		console.log(funding);

		return NextResponse.json(funding, { status: 201 });
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
		const fundings = await prisma.funding.findMany();
		return NextResponse.json(fundings, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch funding data" },
			{ status: 500 }
		);
	}
}
