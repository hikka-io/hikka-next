/** `/u/<reference>` redirects to the current username, so the link survives renames. */
export const userMentionPath = (usernameOrReference: string) =>
    `/u/${usernameOrReference}`;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUserReference = (value: string) => UUID.test(value);

const MENTION_LABEL = /^@[a-zA-Z0-9_]+$/;

export const isMentionLabel = (text: string) => MENTION_LABEL.test(text);

// Serialized raw, so the charset is deliberately narrow: anything that could
// need escaping must not take that path.
const USER_URL = /^(?:https?:\/\/[^\s/()]+)?\/u\/([A-Za-z0-9_-]+)$/;

/** The username or reference a user link points at, or null if it is not one. */
export const userUrlTarget = (url: string) => USER_URL.exec(url)?.[1] ?? null;

export const isUserUrl = (url: string) => USER_URL.test(url);
