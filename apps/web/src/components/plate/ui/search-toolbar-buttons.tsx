import * as React from 'react';

import { createLinkNode } from '@platejs/link';
import { AtSignIcon, SearchIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ContentTypeEnum } from '@hikka/api';

import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { SearchModal } from '@/features/search';
import type { SearchResult } from '@/features/search/search-modal/types';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { userMentionUrl } from '@/utils/mentions';
import { getTitle } from '@/utils/title/get-title';
import { getSiteUrl } from '@/utils/url';

import { restoreSelection } from '../editor/transforms';
import { ToolbarButton } from './toolbar';

export const CONTENT_SEARCH_LABEL = 'Пошук контенту';
export const USER_SEARCH_LABEL = 'Згадати користувача';

const SEARCHABLE_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
];

export function useContentSearchModal() {
    const editor = useEditorRef();
    const { preferences } = useSessionUI();
    const [open, setOpen] = React.useState(false);

    const insertContentLink = (content: SearchResult) => {
        if (!('slug' in content)) return;

        const path = CONTENT_TYPE_LINKS[content.data_type as ContentTypeEnum];

        if (!path) return;

        restoreSelection(editor);

        editor.tf.insertNodes(
            createLinkNode(editor, {
                url: `${getSiteUrl()}${path}/${content.slug}`,
                text: getTitle(
                    content,
                    preferences?.title_language ?? 'title_ua',
                    preferences?.name_language ?? 'name_ua',
                ),
            }),
        );
        editor.tf.focus();
    };

    const modal = (
        <SearchModal
            open={open}
            onOpenChange={setOpen}
            allowedTypes={SEARCHABLE_TYPES}
            onClick={insertContentLink}
            type="button"
            disableHotkey
        />
    );

    return { modal, openSearch: () => setOpen(true) };
}

export function ContentSearchToolbarButton() {
    const { modal, openSearch } = useContentSearchModal();

    return (
        <React.Fragment>
            <ToolbarButton onClick={openSearch} tooltip={CONTENT_SEARCH_LABEL}>
                <SearchIcon />
            </ToolbarButton>

            {modal}
        </React.Fragment>
    );
}

export function useUserSearchModal() {
    const editor = useEditorRef();
    const [open, setOpen] = React.useState(false);

    const insertMention = (content: SearchResult) => {
        if (!('username' in content) || !content.username) return;

        restoreSelection(editor);

        editor.tf.insertNodes(
            createLinkNode(editor, {
                url: userMentionUrl(content.reference),
                text: `@${content.username}`,
            }),
        );
        editor.tf.focus();
    };

    const modal = (
        <SearchModal
            open={open}
            onOpenChange={setOpen}
            content_type={ContentTypeEnum.USER}
            onClick={insertMention}
            type="button"
            disableHotkey
        />
    );

    return { modal, openSearch: () => setOpen(true) };
}

export function UserSearchToolbarButton() {
    const { modal, openSearch } = useUserSearchModal();

    return (
        <React.Fragment>
            <ToolbarButton onClick={openSearch} tooltip={USER_SEARCH_LABEL}>
                <AtSignIcon />
            </ToolbarButton>

            {modal}
        </React.Fragment>
    );
}
