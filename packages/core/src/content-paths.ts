import { ContentTypeEnum } from '@hikka/api';

export const CONTENT_TYPE_LINKS: Record<ContentTypeEnum, string> = {
    [ContentTypeEnum.PERSON]: '/people',
    [ContentTypeEnum.CHARACTER]: '/characters',
    [ContentTypeEnum.ANIME]: '/anime',
    [ContentTypeEnum.EDIT]: '/edit',
    [ContentTypeEnum.COMMENT]: '/comments',
    [ContentTypeEnum.COLLECTION]: '/collections',
    [ContentTypeEnum.MANGA]: '/manga',
    [ContentTypeEnum.NOVEL]: '/novel',
    [ContentTypeEnum.ARTICLE]: '/articles',
    [ContentTypeEnum.USER]: '/u',
    [ContentTypeEnum.HISTORY]: '/history',
};

export function contentPath(type: ContentTypeEnum, slug: string): string {
    return `${CONTENT_TYPE_LINKS[type]}/${slug}`;
}
