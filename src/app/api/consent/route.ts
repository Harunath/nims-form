import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { consentSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log("🚀 Received Data:", body); // Debugging

		const validation = consentSchema.safeParse(body);
		if (!validation.success) {
			console.error("❌ Validation Errors:", validation.error.format());
			return NextResponse.json(
				{ error: validation.error.format() },
				{ status: 400 }
			);
		}

		const consent = await prisma.consent.create({
			data: validation.data,
		});

		return NextResponse.json(consent, { status: 201 });
	} catch (error) {
		console.error("🔥 Error Creating Consent:", error);
		return NextResponse.json(
			{ error: "Failed to create consent" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const consents = await prisma.consent.findMany();
		return NextResponse.json(consents, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch consent data" },
			{ status: 500 }
		);
	}
}
