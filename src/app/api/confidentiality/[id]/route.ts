import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { confidentialitySchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const confidentiality = await prisma.confidentiality.findUnique({
			where: { id: params.id },
		});

		if (!confidentiality) {
			return NextResponse.json(
				{ error: "Confidentiality entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(confidentiality, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch confidentiality entry" },
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
		const validatedData = confidentialitySchema.partial().parse(body);

		const updatedConfidentiality = await prisma.confidentiality.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedConfidentiality, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update confidentiality entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.confidentiality.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Confidentiality entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete confidentiality entry" },
			{ status: 500 }
		);
	}
}
