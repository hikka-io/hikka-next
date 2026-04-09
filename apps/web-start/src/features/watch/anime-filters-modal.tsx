'use client';

import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';

import {
    AnimeFiltersBody,
    AnimeFiltersFooter,
} from '@/features/watch/anime-filters';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content_type?: ContentTypeEnum;
    sort_type: 'anime' | 'watch';
}

/**
 * Controlled modal wrapper for the anime filters. Responsive: Dialog on
 * desktop, Drawer on mobile (via ResponsiveModal).
 */
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
                <AnimeFiltersBody
                    className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4"
                    content_type={content_type}
                    sort_type={sort_type}
                />
                <ResponsiveModalFooter>
                    <AnimeFiltersFooter className="w-full" />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default AnimeFiltersModal;
