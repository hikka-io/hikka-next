import InputParam from '@/app/(pages)/edit/_components/ui/input-param';
import ListParam from '@/app/(pages)/edit/_components/ui/list-param';
import MarkdownParam from '@/app/(pages)/edit/_components/ui/markdown-param';
import {
    ANIME_EDIT_GROUPS,
    ANIME_EDIT_PARAMS,
    CHARACTER_EDIT_GROUPS,
    CHARACTER_EDIT_PARAMS,
    PERSON_EDIT_GROUPS,
    PERSON_EDIT_PARAMS,
} from '@/utils/constants';

export const getEditParamComponent = (type: Hikka.EditParamType) => {
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
    content_type: API.ContentType,
    filter?: string[],
) => {
    let params: Record<string, Hikka.EditParam[]> = {};

    switch (content_type) {
        case 'anime':
            params = ANIME_EDIT_PARAMS;
            break;
        case 'character':
            params = CHARACTER_EDIT_PARAMS;
            break;
        case 'person':
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

export const getEditGroups = (content_type: API.ContentType) => {
    switch (content_type) {
        case 'anime':
            return ANIME_EDIT_GROUPS;
        case 'character':
            return CHARACTER_EDIT_GROUPS;
        case 'person':
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
