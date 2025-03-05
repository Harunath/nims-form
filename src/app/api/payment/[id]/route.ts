import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { paymentSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const payment = await prisma.payment.findUnique({
			where: { id: params.id },
		});

		if (!payment) {
			return NextResponse.json(
				{ error: "Payment entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(payment, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch payment entry" },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const body = await req.json();
		const validatedData = paymentSchema.partial().parse(body);

		const updatedPayment = await prisma.payment.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedPayment, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update payment entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.payment.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Payment entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete payment entry" },
			{ status: 500 }
		);
	}
}
