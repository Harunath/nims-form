import mongoose, { Schema, Document } from "mongoose";

// ✅ Define File Schema
interface IFile extends Document {
	applicationId: string;
	name: string; // File name
	fileId: string; // GridFS file ID
	createdAt: Date;
	updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
	{
		applicationId: { type: String, required: true },
		name: { type: String, required: true },
		fileId: { type: String, required: true }, // ID of the file in GridFS
	},
	{ timestamps: true } // ✅ Auto-generates `createdAt` & `updatedAt`
);

// ✅ Export the model
export default mongoose.models.File ||
	mongoose.model<IFile>("File", FileSchema);
