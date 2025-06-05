import { ContentTypeEnum, EditContentType } from '@hikka/client';
import { ComponentType } from 'react';

import InputParam from '@/features/edit/edit-forms/params/input-param';
import ListParam from '@/features/edit/edit-forms/params/list-param';
import MarkdownParam from '@/features/edit/edit-forms/params/markdown-param';

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
} from './constants/edit';

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
    content_type: EditContentType,
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

export const getEditGroups = (content_type: EditContentType) => {
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
