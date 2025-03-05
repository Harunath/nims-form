import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { applicationSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = applicationSchema.parse(body);

		const application = await prisma.application.create({
			data: validatedData,
		});

		return NextResponse.json(application, { status: 201 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}
}

export async function GET() {
	try {
		const applications = await prisma.application.findMany();
		return NextResponse.json(applications, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch applications" },
			{ status: 500 }
		);
	}
}
