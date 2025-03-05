import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { consentSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const consent = await prisma.consent.findUnique({
			where: { id: params.id },
		});

		if (!consent) {
			return NextResponse.json(
				{ error: "Consent entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(consent, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch consent entry" },
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
		const validatedData = consentSchema.partial().parse(body);

		const updatedConsent = await prisma.consent.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedConsent, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update consent entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.consent.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Consent entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to delete consent entry" },
			{ status: 500 }
		);
	}
}
