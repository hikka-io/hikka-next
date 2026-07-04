import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import FiltersFooter from '@/features/filters/filters-footer';

import { AnimeFiltersBody } from './anime-filters';

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
        <ResponsiveModal
            type="sheet"
            forceDesktop
            open={open}
            onOpenChange={onOpenChange}
        >
            <ResponsiveModalContent className="md:max-w-xl" title="Фільтри">
                {/* -m-4 p-4 cancels parent padding so the scroll area fills edge-to-edge */}
                <AnimeFiltersBody
                    className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4"
                    content_type={content_type}
                    sort_type={sort_type}
                />
                <ResponsiveModalFooter>
                    <FiltersFooter
                        className="w-full"
                        contentType={
                            sort_type === 'anime'
                                ? ContentTypeEnum.ANIME
                                : undefined
                        }
                    />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default AnimeFiltersModal;
