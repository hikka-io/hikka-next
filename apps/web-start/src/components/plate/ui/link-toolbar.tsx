'use client';

import {
    type UseVirtualFloatingOptions,
    flip,
    offset,
} from '@platejs/floating';
import { getLinkAttributes } from '@platejs/link';
import {
    useFloatingLinkEdit,
    useFloatingLinkEditState,
} from '@platejs/link/react';
import { cva } from 'class-variance-authority';
import { ExternalLink, Unlink } from 'lucide-react';
import type { TLinkElement } from 'platejs';
import { KEYS } from 'platejs';
import {
    useEditorRef,
    useEditorSelection,
    usePluginOption,
} from 'platejs/react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useLinkDialogContext } from './link-dialog';

const popoverVariants = cva(
    'bg-popover text-popover-foreground ring-foreground/10 z-50 w-auto rounded-lg p-1 shadow-md ring-1 outline-hidden',
);

export function LinkFloatingToolbar() {
    const { openEdit } = useLinkDialogContext();

    const activeCommentId = usePluginOption({ key: KEYS.comment }, 'activeId');
    const activeSuggestionId = usePluginOption(
        { key: KEYS.suggestion },
        'activeId',
    );

    const floatingOptions: UseVirtualFloatingOptions = React.useMemo(() => {
        return {
            middleware: [
                offset(8),
                flip({
                    fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
                    padding: 12,
                }),
            ],
            placement:
                activeSuggestionId || activeCommentId
                    ? 'top-start'
                    : 'bottom-start',
        };
    }, [activeCommentId, activeSuggestionId]);

    const editState = useFloatingLinkEditState({
        floatingOptions,
    });
    const {
        props: editProps,
        ref: editRef,
        unlinkButtonProps,
    } = useFloatingLinkEdit(editState);

    if (!editState.isOpen) return null;

    return createPortal(
        <div ref={editRef} className={popoverVariants()} {...editProps}>
            <div className="box-content flex items-center">
                <button
                    className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                    type="button"
                    onClick={() => openEdit()}
                >
                    Редагувати посилання
                </button>

                <Separator orientation="vertical" />

                <LinkOpenButton />

                <Separator orientation="vertical" />

                <button
                    className={buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                    })}
                    type="button"
                    {...unlinkButtonProps}
                >
                    <Unlink width={18} />
                </button>
            </div>
        </div>,
        document.body,
    );
}

function LinkOpenButton() {
    const editor = useEditorRef();
    const selection = useEditorSelection();

    const attributes = React.useMemo(
        () => {
            const entry = editor.api.node<TLinkElement>({
                match: { type: editor.getType(KEYS.link) },
            });
            if (!entry) {
                return {};
            }
            const [element] = entry;
            return getLinkAttributes(editor, element);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editor, selection],
    );

    return (
        <a
            {...attributes}
            className={buttonVariants({
                size: 'sm',
                variant: 'ghost',
            })}
            onMouseOver={(e) => {
                e.stopPropagation();
            }}
            aria-label="Відкрити посилання в новій вкладці"
            target="_blank"
        >
            <ExternalLink width={18} />
        </a>
    );
}
