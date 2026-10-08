import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import {
    AgeRating,
    Genre,
    Issues,
    Magazine,
    MalId,
    MediaType,
    ReleaseStatus,
    Season,
    Studio,
    Year,
} from '@/features/filters';
import { CONTENT_ISSUES } from '@/utils/labels/enum-labels';

import type { TodoFiltersValue } from './todo-filters-value';

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
