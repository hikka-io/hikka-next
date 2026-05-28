'use client';

import { ReadContentType } from '@hikka/client';
import { FC } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';

import { ReadFiltersBody, ReadFiltersFooter } from '@/features/read/read-filters';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
}

/**
 * Controlled modal wrapper for the read filters. Responsive: Dialog on
 * desktop, Drawer on mobile (via ResponsiveModal).
 */
const ReadFiltersModal: FC<Props> = ({
    open,
    onOpenChange,
    content_type,
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
                <ReadFiltersBody
                    className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4"
                    content_type={content_type}
                    sort_type={sort_type}
                />
                <ResponsiveModalFooter>
                    <ReadFiltersFooter className="w-full" />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default ReadFiltersModal;
