import type { ComponentType } from 'react';

import { ContentTypeEnum, type EditContentTypeEnum } from '@hikka/api';

import {
    ANIME_EDIT_GROUPS,
    ANIME_EDIT_PARAMS,
    CHARACTER_EDIT_GROUPS,
    CHARACTER_EDIT_PARAMS,
    MANGA_EDIT_GROUPS,
    MANGA_EDIT_PARAMS,
    NOVEL_EDIT_GROUPS,
    NOVEL_EDIT_PARAMS,
    PERSON_EDIT_GROUPS,
    PERSON_EDIT_PARAMS,
} from '../../../../utils/constants/edit';
import type { EditMainContent } from '../../types';
import InputParam from '../components/params/input-param';
import ListParam from '../components/params/list-param';
import MarkdownParam from '../components/params/markdown-param';

export const getEditParamComponent = (
    type: Hikka.EditParamType,
): ComponentType<any> => {
    switch (type) {
        case 'input':
            return InputParam;
        case 'markdown':
            return MarkdownParam;
        case 'list':
            return ListParam;
    }
};

export const getEditParams = (
    content_type: EditContentTypeEnum,
    filter?: string[],
) => {
    let params: Record<string, Hikka.EditParam[]> = {};

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            params = ANIME_EDIT_PARAMS;
            break;
        case ContentTypeEnum.MANGA:
            params = MANGA_EDIT_PARAMS;
            break;
        case ContentTypeEnum.NOVEL:
            params = NOVEL_EDIT_PARAMS;
            break;
        case ContentTypeEnum.CHARACTER:
            params = CHARACTER_EDIT_PARAMS;
            break;
        case ContentTypeEnum.PERSON:
            params = PERSON_EDIT_PARAMS;
            break;
    }

    if (filter) {
        params = Object.fromEntries(
            Object.keys(params)
                .map((key) => [
                    key,
                    params[key].filter((param) => filter.includes(param.slug)),
                ])
                .filter(([, value]) => value.length > 0),
        );
    }

    return params;
};

export const getEditGroups = (content_type: EditContentTypeEnum) => {
    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return ANIME_EDIT_GROUPS;
        case ContentTypeEnum.MANGA:
            return MANGA_EDIT_GROUPS;
        case ContentTypeEnum.NOVEL:
            return NOVEL_EDIT_GROUPS;
        case ContentTypeEnum.CHARACTER:
            return CHARACTER_EDIT_GROUPS;
        case ContentTypeEnum.PERSON:
            return PERSON_EDIT_GROUPS;
    }
};

/** Slug of the native/original title field (the one editors translate from). */
export const getNativeTitleSlug = (
    content_type: EditContentTypeEnum,
): string | undefined => {
    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return 'title_ja';
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return 'title_original';
        case ContentTypeEnum.CHARACTER:
            return 'name_ja';
        case ContentTypeEnum.PERSON:
            return 'name_native';
    }
};

/** Whether the content lacks its native title (reviewer must verify by hand). */
export const isNativeTitleMissing = (
    content_type: EditContentTypeEnum,
    content: Record<string, unknown> | null | undefined,
) => {
    const slug = getNativeTitleSlug(content_type);

    if (!slug || !content) return false;

    const value = content[slug];

    return typeof value !== 'string' || value.trim().length === 0;
};

export const getEditParamSlugs = (
    params: Record<string, Hikka.EditParam[]>,
) => {
    return Object.values(params)
        .flat()
        .map((param) => param.slug);
};

export const getFilteredEditParams = (
    paramSlugs: string[],
    data: Record<string, any>,
) => {
    return Object.keys(data).reduce((acc, key) => {
        if (paramSlugs.includes(key)) {
            if (Array.isArray(data[key])) {
                return {
                    ...acc,
                    [key]: (data[key] as { value: string }[]).map(
                        (v: { value: string }) => v.value,
                    ),
                };
            }

            return { ...acc, [key]: data[key] };
        }

        return acc;
    }, {});
};

/**
 * Build the TanStack Form default values for the create / quick-edit forms: the current
 * content spread as-is, `synonyms` mapped to the `{ value }[]` shape the list field uses,
 * an empty `description`, and the `auto` (accept-on-create) flag.
 */
export const getEditFormDefaults = (
    content: EditMainContent,
    auto: boolean,
) => {
    return {
        description: '',
        ...content,
        synonyms:
            (content &&
                'synonyms' in content &&
                content.synonyms!.map((v: string) => ({ value: v }))) ||
            [],
        auto,
    } as Record<string, unknown> & {
        description: string;
        auto: boolean;
    };
};
