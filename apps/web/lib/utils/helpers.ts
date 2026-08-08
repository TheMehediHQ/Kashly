import { ObjectId } from "mongodb";

export function normalizeEmail(email: string | undefined): string {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id);
}

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
}) {
  const store = new Map<string, { count: number; resetAt: number }>();

  return (req: any, res: any, next: any) => {
    const key = `${req.ip}`;
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (existing.count >= options.max) {
      return res.status(429).json({ message: options.message });
    }

    existing.count += 1;
    store.set(key, existing);
    next();
  };
}

export function createAccountLimiter(options: {
  keyPrefix: string;
  maxAttempts: number;
  windowMs: number;
  message: string;
}) {
  const store = new Map<string, { count: number; resetAt: number }>();

  return (req: any, res: any, next: any) => {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return next();
    }

    const key = `${options.keyPrefix}:${req.ip}:${email}`;
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (existing.count >= options.maxAttempts) {
      return res.status(429).json({ message: options.message });
    }

    existing.count += 1;
    store.set(key, existing);
    next();
  };
}
