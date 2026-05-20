import type { users } from "../../db/schema";

type User = typeof users.$inferSelect;
type UserDto = Omit<User, "passwordHash">;

export function toUserDto(user: User): UserDto {
  const { passwordHash, ...rest } = user;
  return rest;
}
