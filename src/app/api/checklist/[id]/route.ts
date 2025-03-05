import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checklistSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const checklist = await prisma.checklist.findUnique({
			where: { id: params.id },
		});

		if (!checklist) {
			return NextResponse.json(
				{ error: "Checklist entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(checklist, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch checklist entry" },
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
		const validatedData = checklistSchema.partial().parse(body);

		const updatedChecklist = await prisma.checklist.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedChecklist, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update checklist entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.checklist.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Checklist entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete checklist entry" },
			{ status: 500 }
		);
	}
}
