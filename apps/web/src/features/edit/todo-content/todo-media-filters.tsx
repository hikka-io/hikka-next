import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import AgeRating from '@/features/filters/age-rating';
import Genre from '@/features/filters/genre';
import Issues from '@/features/filters/issues';
import Magazine from '@/features/filters/magazine';
import MalId from '@/features/filters/mal-id';
import MediaType from '@/features/filters/media-type';
import ReleaseStatus from '@/features/filters/release-status';
import Season from '@/features/filters/season';
import Studio from '@/features/filters/studio';
import Year from '@/features/filters/year';

import type { TodoFiltersValue } from './todo-filters-value';

const CONTENT_ISSUES: Hikka.FilterProperty<string> = {
    title_ua: { title_ua: 'Назва (укр)', title_en: 'Title (ua)' },
    title_en: { title_ua: 'Назва (англ)', title_en: 'Title (en)' },
    title_original: { title_ua: 'Назва (ориг)', title_en: 'Title (original)' },
    synopsis_ua: { title_ua: 'Опис (укр)', title_en: 'Synopsis (ua)' },
    synopsis_en: { title_ua: 'Опис (англ)', title_en: 'Synopsis (en)' },
};

type Props = {
    contentType:
        | typeof ContentTypeEnum.ANIME
        | typeof ContentTypeEnum.MANGA
        | typeof ContentTypeEnum.NOVEL;
    value: TodoFiltersValue;
    onChange: (value: TodoFiltersValue) => void;
};

const TodoMediaFilters: FC<Props> = ({ contentType, value, onChange }) => {
    const isAnime = contentType === ContentTypeEnum.ANIME;

    return (
        <>
            <MalId
                resetKey={contentType}
                value={value.mal_id}
                onChange={(mal_id) => onChange({ ...value, mal_id })}
            />
            <Issues
                properties={CONTENT_ISSUES}
                value={value.issues}
                onChange={(issues) => onChange({ ...value, issues })}
            />
            <Genre />
            {isAnime ? (
                <Studio />
            ) : (
                <Magazine
                    value={value.magazines}
                    onChange={(magazines) => onChange({ ...value, magazines })}
                />
            )}
            <ReleaseStatus />
            {isAnime && <Season />}
            <MediaType content_type={contentType} />
            {isAnime && <AgeRating />}
            <Year />
        </>
    );
};

export default TodoMediaFilters;
