import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { methodologySchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const methodology = await prisma.methodology.findUnique({
			where: { id: params.id },
		});

		if (!methodology) {
			return NextResponse.json(
				{ error: "Methodology entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(methodology, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch methodology entry" },
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
		const validatedData = methodologySchema.partial().parse(body);

		const updatedMethodology = await prisma.methodology.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedMethodology, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update methodology entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.methodology.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Methodology entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete methodology entry" },
			{ status: 500 }
		);
	}
}
