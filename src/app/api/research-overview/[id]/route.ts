import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { researchOverviewSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const researchOverview = await prisma.researchOverview.findUnique({
			where: { id: params.id },
		});

		if (!researchOverview) {
			return NextResponse.json(
				{ error: "Research overview not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(researchOverview, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch research overview" },
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
		const validatedData = researchOverviewSchema.partial().parse(body);

		const updatedResearchOverview = await prisma.researchOverview.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedResearchOverview, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update research overview" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.researchOverview.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Research overview deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete research overview" },
			{ status: 500 }
		);
	}
}
