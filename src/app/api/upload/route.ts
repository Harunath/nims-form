import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/mongodb/dbConfig";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
	try {
		console.log("📩 Receiving file upload...");

		// ✅ Ensure MongoDB is connected before uploading
		const { db } = await connectToMongoDB();
		const bucket = new GridFSBucket(db, { bucketName: "uploads" });

		const formData = await req.formData();
		const file = formData.get("file") as File;
		const applicationId = formData.get("applicationId") as string;
		const name = formData.get("name") as string;

		// ✅ Log received data
		console.log("📌 Received file:", file);
		console.log("📌 Application ID:", applicationId);
		console.log("📌 File name:", name);

		// ❌ If any required field is missing
		if (!file || !applicationId || !name) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// ✅ Convert File to Readable Stream
		const buffer = await file.arrayBuffer();
		const stream = Readable.from(Buffer.from(buffer));

		const uploadStream = bucket.openUploadStream(name, {
			metadata: { applicationId, name, contentType: file.type },
		});

		// ✅ Pipe File into GridFS and Wait for Completion
		const uploadPromise = new Promise<string>((resolve, reject) => {
			stream
				.pipe(uploadStream)
				.on("finish", () => {
					console.log("✅ File uploaded successfully:", uploadStream.id);
					resolve(uploadStream.id.toString()); // Convert ObjectId to string
				})
				.on("error", (err) => {
					console.error("❌ GridFS Upload Error:", err);
					reject(err);
				});
		});

		const fileId = await uploadPromise; // ✅ Wait for upload to finish

		return NextResponse.json({ message: "File uploaded successfully", fileId });
	} catch (error) {
		console.error("❌ Upload error:", error);
		return NextResponse.json({ error: "File upload failed" }, { status: 500 });
	}
}
