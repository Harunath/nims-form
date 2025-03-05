import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { participantSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const participant = await prisma.participantInfo.findUnique({
			where: { id: params.id },
		});

		if (!participant) {
			return NextResponse.json(
				{ error: "Participant entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(participant, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch participant entry" },
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
		const validatedData = participantSchema.partial().parse(body);

		const updatedParticipant = await prisma.participantInfo.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedParticipant, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update participant entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.participantInfo.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Participant entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete participant entry" },
			{ status: 500 }
		);
	}
}
