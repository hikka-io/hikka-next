import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import ClearFiltersFooter from '@/features/filters/clear-filters-footer';
import ContentType from '@/features/filters/content-type';
import EditStatusFilter from '@/features/filters/edit-status';
import Sort from '@/features/filters/sort';
import User from '@/features/filters/user';
import { cn } from '@/utils/cn';

type Props = {
    className?: string;
};

/** Filter fields only — no footer/padding; use inside modals or custom wrappers. */
export const EditFiltersBody: FC<Props> = ({ className }) => {
    return (
        <div className={cn('flex flex-col gap-8', className)}>
            <Sort sort_type="edit" />
            <EditStatusFilter />
            <ContentType
                contentTypes={[
                    ContentTypeEnum.ANIME,
                    ContentTypeEnum.MANGA,
                    ContentTypeEnum.NOVEL,
                    ContentTypeEnum.CHARACTER,
                    ContentTypeEnum.PERSON,
                ]}
            />
            <User title="Автор" paramKey="author" />
            <User title="Модератор" paramKey="moderator" />
        </div>
    );
};

/** Side-panel composition: scrollable filter body + sticky footer. */
const EditFilters: FC<Props> = ({ className }) => {
    return (
        <div className={cn('flex flex-1 flex-col lg:w-full', className)}>
            <EditFiltersBody className="flex-1 overflow-y-auto p-4 py-8" />
            <ClearFiltersFooter className="shrink-0 border-t p-4" />
        </div>
    );
};

export default EditFilters;
