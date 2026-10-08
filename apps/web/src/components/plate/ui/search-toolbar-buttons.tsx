import * as React from 'react';

import { AtSignIcon, SearchIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ContentTypeEnum, type UserResponse } from '@hikka/api';

import { type SearchContent, SearchModal } from '@/features/search';
import { useSessionUI } from '@/services/session';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { getTitle } from '@/utils/title/get-title';

import {
    insertContentLink,
    insertMentionLink,
    restoreSelection,
} from '../editor/transforms';
import { ToolbarButton } from './toolbar';

export const CONTENT_SEARCH_LABEL = 'Пошук контенту';
export const USER_SEARCH_LABEL = 'Згадати користувача';

const SEARCHABLE_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
] satisfies readonly ContentTypeEnum[];

export function useContentSearchModal() {
    const editor = useEditorRef();
    const { preferences } = useSessionUI();
    const [open, setOpen] = React.useState(false);

    const insertContent = (content: SearchContent | UserResponse) => {
        if (!('slug' in content)) return;

        const type = content.data_type as ContentTypeEnum;

        if (!CONTENT_TYPE_LINKS[type]) return;

        restoreSelection(editor);

        insertContentLink(editor, {
            type,
            slug: content.slug,
            text: getTitle(
                content,
                preferences?.title_language ?? 'title_ua',
                preferences?.name_language ?? 'name_ua',
            ),
        });
        editor.tf.focus();
    };

    const modal = (
        <SearchModal
            open={open}
            onOpenChange={setOpen}
            allowedTypes={SEARCHABLE_TYPES}
            onClick={insertContent}
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

    const insertMention = (content: SearchContent | UserResponse) => {
        if (!('username' in content) || !content.username) return;

        restoreSelection(editor);

        insertMentionLink(editor, content);
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
