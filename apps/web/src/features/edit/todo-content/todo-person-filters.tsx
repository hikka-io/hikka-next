import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import ContentSlug from '@/features/filters/content-slug';
import ContentType from '@/features/filters/content-type';
import Issues from '@/features/filters/issues';

import type { TodoFiltersValue } from './todo-filters-value';

const PERSON_ISSUES: Hikka.FilterProperty<string> = {
    name_ua: { title_ua: "Ім'я (укр)", title_en: 'Name (ua)' },
    name_en: { title_ua: "Ім'я (англ)", title_en: 'Name (en)' },
    name_original: { title_ua: "Ім'я (ориг)", title_en: 'Name (original)' },
};

const CHARACTER_ISSUES: Hikka.FilterProperty<string> = {
    ...PERSON_ISSUES,
    description_ua: { title_ua: 'Опис (укр)', title_en: 'Description (ua)' },
};

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
