import { NextResponse } from "next/server";
import FileModel from "@/mongodb/models"; // ✅ Import File Schema

export async function GET(
	req: Request,
	{ params }: { params: { applicationId: string } }
) {
	try {
		const files = await FileModel.find({
			applicationId: params.applicationId,
		}).lean();

		return NextResponse.json({ success: true, files }, { status: 200 });
	} catch (error) {
		console.error("Fetch Files Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch files" },
			{ status: 500 }
		);
	}
}
