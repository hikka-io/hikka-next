import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import ContentSlug from '@/features/filters/content-slug';
import ContentType from '@/features/filters/content-type';
import Issues from '@/features/filters/issues';
import { CHARACTER_ISSUES, PERSON_ISSUES } from '@/utils/constants/common';

import type { TodoFiltersValue } from './todo-filters-value';

const MEDIA_CONTENT_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
];

type Props = {
    contentType:
        | typeof ContentTypeEnum.CHARACTER
        | typeof ContentTypeEnum.PERSON;
    value: TodoFiltersValue;
    onChange: (value: TodoFiltersValue) => void;
};

const TodoPersonFilters: FC<Props> = ({ contentType, value, onChange }) => {
    return (
        <>
            <Issues
                properties={
                    contentType === ContentTypeEnum.CHARACTER
                        ? CHARACTER_ISSUES
                        : PERSON_ISSUES
                }
                value={value.issues}
                onChange={(issues) => onChange({ ...value, issues })}
            />
            <ContentType contentTypes={MEDIA_CONTENT_TYPES} />
            <ContentSlug
                resetKey={contentType}
                value={value.content_slug}
                onChange={(content_slug) =>
                    onChange({ ...value, content_slug })
                }
            />
        </>
    );
};

export default TodoPersonFilters;
