import md5 from "md5";

// -- Helper functions ---------------------------------------------------------
export function getGravatarUrl(email: string, size = 80) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}
