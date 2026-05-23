import { hash, verify } from "@node-rs/argon2";
import { generateRandomString, alphabet } from "oslo/crypto";
import * as sessionsRepo from "../repositories/sessions.repository";
import * as usersRepo from "../repositories/users.repository";
import { DuplicateUserFound } from "../exceptions/duplicate-user.exception";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";
import { getGravatarUrl } from "../utils/gravatar";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

// -- Passwords ----------------------------------------------------------------

export async function hashPassword(password: string) {
  return hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(hashStr: string, password: string) {
  return verify(hashStr, password);
}

// -- Sessions -----------------------------------------------------------------

export async function createSession(userId: number) {
  const sessionId = generateRandomString(40, alphabet("a-z", "A-Z", "0-9"));
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sessionsRepo.insertSession(sessionId, userId, expiresAt);

  return { sessionId, expiresAt };
}

export async function validateSession(sessionId: string) {
  const result = await sessionsRepo.findSessionWithUser(sessionId);

  if (!result) return { session: null, user: null };

  const { session, user } = result;

  if (Date.now() > session.expiresAt.getTime()) {
    await sessionsRepo.deleteSession(sessionId);
    return { session: null, user: null };
  }

  // Rolling expiry - extend session on activity
  if (Date.now() > session.expiresAt.getTime() - SESSION_DURATION_MS / 2) {
    const newExpiry = new Date(Date.now() + SESSION_DURATION_MS);
    await sessionsRepo.updateSessionExpiry(sessionId, newExpiry);
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string) {
  await sessionsRepo.deleteSession(sessionId);
}

// -- Users --------------------------------------------------------------------

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const existing = await usersRepo.findUserByEmail(email);
  if (existing) throw new DuplicateUserFound("Email is already registered");

  const passwordHash = await hashPassword(password);
  const gravatarUrl = getGravatarUrl(email.trim().toLowerCase(), 200);
  return usersRepo.insertUser(
    email,
    passwordHash,
    firstName,
    lastName,
    gravatarUrl,
  );
}

export async function loginUser(email: string, password: string) {
  const user = await usersRepo.findUserByEmail(email);
  if (!user) throw new InvalidCredentialsException("email");

  const validPassword = await verifyPassword(user.passwordHash, password);
  if (!validPassword) throw new InvalidCredentialsException("password");

  return user;
}
