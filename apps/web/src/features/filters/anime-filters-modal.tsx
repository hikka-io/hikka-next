import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { AnimeFiltersBody } from './anime-filters';
import FiltersFooter from './filters-footer';
import FiltersModal from './filters-modal';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content_type?: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
};

/** Controlled modal wrapper for the anime filters. */
const AnimeFiltersModal: FC<Props> = ({
    open,
    onOpenChange,
    content_type = ContentTypeEnum.ANIME,
    sort_type,
}) => {
    return (
        <FiltersModal
            open={open}
            onOpenChange={onOpenChange}
            body={
                // -m-4 p-4 cancels parent padding so the scroll area fills edge-to-edge
                <AnimeFiltersBody
                    className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4"
                    content_type={content_type}
                    sort_type={sort_type}
                />
            }
            footer={
                <FiltersFooter
                    className="w-full"
                    contentType={
                        sort_type === 'anime'
                            ? ContentTypeEnum.ANIME
                            : undefined
                    }
                    onDone={() => onOpenChange(false)}
                />
            }
        />
    );
};

export default AnimeFiltersModal;
