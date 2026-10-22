// Mirrors the backend `is_valid_tag` (app/utils.py), which the spec does not carry.
export const TAG_LENGTH = { min: 3, max: 16 } as const;

const TAG_PATTERN = new RegExp(
    `^[a-zа-яіїґ]{${TAG_LENGTH.min},${TAG_LENGTH.max}}$`,
);
const FORBIDDEN_LETTERS = /[ёъыэ]/;

export const normalizeTag = (tag: string) => tag.trim().toLowerCase();

export const isValidTag = (tag: string) =>
    TAG_PATTERN.test(tag) && !FORBIDDEN_LETTERS.test(tag);
