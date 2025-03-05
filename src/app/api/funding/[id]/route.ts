import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fundingSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const funding = await prisma.funding.findUnique({
			where: { id: params.id },
		});

		if (!funding) {
			return NextResponse.json(
				{ error: "Funding entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(funding, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch funding entry" },
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
		const validatedData = fundingSchema.partial().parse(body);

		const updatedFunding = await prisma.funding.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedFunding, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update funding entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.funding.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Funding entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete funding entry" },
			{ status: 500 }
		);
	}
}
