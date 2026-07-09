import { MongoClient } from "mongodb";

import { env } from "#/env/index.js";

export class MongoDb {
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(env.MONGODB_URI);
  }

  async connect() {
    await this.client.connect();
  }

  getClient() {
    return this.client;
  }
}

export const mongoDb = new MongoDb();

export async function connectDatabase(): Promise<void> {
  await mongoDb.connect();
}

export function getDatabase() {
  return mongoDb.getClient().db();
}

export const collections = {
  users: "users",
} as const;
