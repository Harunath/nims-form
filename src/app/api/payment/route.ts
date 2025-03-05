import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { paymentSchema } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = paymentSchema.parse(body);

		// Ensure the application exists before adding payment details
		const application = await prisma.application.findUnique({
			where: { id: validatedData.applicationId },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 }
			);
		}

		const payment = await prisma.payment.create({
			data: validatedData,
		});

		return NextResponse.json(payment, { status: 201 });
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
		const payments = await prisma.payment.findMany();
		return NextResponse.json(payments, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch payment data" },
			{ status: 500 }
		);
	}
}
