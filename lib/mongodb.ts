/**
 * lib/mongodb.ts
 *
 * Singleton MongoDB client — prevents creating a new connection
 * on every hot-reload in development.
 *
 * INTERVIEW TALKING POINT:
 * "In dev, Next.js hot-reloads modules constantly. Without this
 * pattern, we'd exhaust MongoDB's connection pool. We store the
 * promise on the global object so it survives hot reloads."
 */

import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to your .env.local file')
}

// Extend Node's global type to hold our cached client
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In dev: reuse existing client across hot reloads
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production: always create a fresh client
  const client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
}

export default clientPromise

// Helper: get the "meridian" database directly
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db('meridian')
}
