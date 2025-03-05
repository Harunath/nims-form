// src/global.d.ts
import { MongoClient, Db, GridFSBucket } from "mongodb";

declare global {
	let _mongoClientPromise:
		| Promise<{ client: MongoClient; db: Db; bucket: GridFSBucket }>
		| undefined;
}

declare global {
	namespace globalThis {
		let _mongoClientPromise:
			| Promise<{ client: MongoClient; db: Db; bucket: GridFSBucket }>
			| undefined;
	}
}
