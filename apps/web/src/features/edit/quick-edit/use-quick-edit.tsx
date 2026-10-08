import { lazy, Suspense, useState } from 'react';

import { type ContentTypeEnum, EditContentTypeEnum } from '@hikka/api';

import { useSession } from '@/services/session';

const QuickEditModal = lazy(() => import('./quick-edit-modal'));

const EDIT_CONTENT_TYPES = new Set<string>(Object.values(EditContentTypeEnum));

const isEditContentType = (
    contentType: ContentTypeEnum,
): contentType is EditContentTypeEnum => EDIT_CONTENT_TYPES.has(contentType);

export function useQuickEdit(contentType: ContentTypeEnum, slug: string) {
    const { isModerator } = useSession();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    const canQuickEdit = isModerator() && isEditContentType(contentType);

    const preload = () => {
        if (canQuickEdit) setMounted(true);
    };

    const openDeferred = () => {
        setMounted(true);
        // Defer so a closing menu releases its `pointer-events: none` on <body>.
        setTimeout(() => setOpen(true), 0);
    };

    // Stays mounted after the first open so Base UI can play the exit transition.
    const modal =
        canQuickEdit && mounted ? (
            <Suspense fallback={null}>
                <QuickEditModal
                    slug={slug}
                    content_type={contentType}
                    open={open}
                    onOpenChange={setOpen}
                />
            </Suspense>
        ) : null;

    return { canQuickEdit, preload, openDeferred, modal };
}
