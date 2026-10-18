// Mirrors the backend `is_valid_tag` (app/utils.py), which the spec does not carry.
export const ARTICLE_TAG_LENGTH = { min: 3, max: 16 } as const;

const TAG_PATTERN = new RegExp(
    `^[a-zа-яіїґ]{${ARTICLE_TAG_LENGTH.min},${ARTICLE_TAG_LENGTH.max}}$`,
);
const FORBIDDEN_LETTERS = /[ёъыэ]/;

export const normalizeArticleTag = (tag: string) => tag.trim().toLowerCase();

export const isValidArticleTag = (tag: string) =>
    TAG_PATTERN.test(tag) && !FORBIDDEN_LETTERS.test(tag);
