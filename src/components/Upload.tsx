"use client";

import { useState } from "react";

export default function FileUpload({
	applicationId,
	fileName,
	onUpload,
}: {
	applicationId: string;
	fileName: string;
	onUpload: (fileId: string) => void;
}) {
	const [file, setFile] = useState<File | null>(null);
	const [name, setName] = useState<string>(fileName);
	const [message, setMessage] = useState<string | null>(null);

	async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!file || !name) return;

		const formData = new FormData();
		formData.append("file", file);
		formData.append("applicationId", applicationId!);
		formData.append("name", name); // ✅ Send file name

		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();
		console.log("📤 Upload response:", data);
		onUpload(data.fileId);
		setMessage(data.message || data.error);
	}

	return (
		<div>
			<form onSubmit={handleUpload}>
				<input
					type="file"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
				/>
				<input
					type="text"
					placeholder="File Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button className="bg-blue-400 p-2 rounded" type="submit">
					Upload
				</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}
