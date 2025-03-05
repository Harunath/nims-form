import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { declarationSchema } from "@/lib/validation";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const declaration = await prisma.declaration.findUnique({
			where: { id: params.id },
		});

		if (!declaration) {
			return NextResponse.json(
				{ error: "Declaration entry not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(declaration, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch declaration entry" },
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
		const validatedData = declarationSchema.partial().parse(body);

		const updatedDeclaration = await prisma.declaration.update({
			where: { id: params.id },
			data: validatedData,
		});

		return NextResponse.json(updatedDeclaration, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Failed to update declaration entry" },
			{ status: 400 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await prisma.declaration.delete({ where: { id: params.id } });
		return NextResponse.json(
			{ message: "Declaration entry deleted" },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Failed to delete declaration entry" },
			{ status: 500 }
		);
	}
}
