import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { confidentialitySchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log("🚀 Received Data:", body); // Debugging incoming request

		const validation = confidentialitySchema.safeParse(body);
		if (!validation.success) {
			console.error("❌ Validation Errors:", validation.error.format());
			return NextResponse.json(
				{ error: validation.error.format() },
				{ status: 400 }
			);
		}

		const confidentiality = await prisma.confidentiality.create({
			data: validation.data,
		});

		return NextResponse.json(confidentiality, { status: 201 });
	} catch (error) {
		console.error("🔥 Error Creating Confidentiality:", error);
		return NextResponse.json(
			{ error: "Failed to create confidentiality record" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const confidentialityEntries = await prisma.confidentiality.findMany();
		return NextResponse.json(confidentialityEntries, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch confidentiality data" },
			{ status: 500 }
		);
	}
}
