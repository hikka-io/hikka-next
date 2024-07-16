import { ReactNode } from 'react';
import MaterialSymbolsChatErrorOutlineRounded from '~icons/material-symbols/chat-error-outline-rounded';
import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded';
import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';
import MaterialSymbolsDriveFileRenameOutlineOutlineRounded from '~icons/material-symbols/drive-file-rename-outline-outline-rounded';

const TITLES: Record<API.ModerationType, string> = {
    edit_accepted: 'Прийнято правку',
    edit_denied: 'Відхилено правку',
    edit_updated: 'Оновлено правку',
    comment_hidden: 'Видалено',
    collection_deleted: 'Видалено',
    collection_updated: 'Оновлено',
};

const HREF_TEXT: Record<API.ModerationType, string> = {
    edit_accepted: '',
    edit_denied: '',
    edit_updated: '',
    comment_hidden: 'коментар',
    collection_deleted: 'колекцію',
    collection_updated: 'колекцію',
};

const ICONS: Record<API.ModerationType, ReactNode> = {
    edit_accepted: <MaterialSymbolsCheckRounded className="text-[#50e3c2]" />,
    edit_denied: <MaterialSymbolsCloseRounded className="text-[#d93036]" />,
    edit_updated: (
        <MaterialSymbolsDriveFileRenameOutlineOutlineRounded className="text-muted-foreground" />
    ),
    comment_hidden: (
        <MaterialSymbolsChatErrorOutlineRounded className="text-muted-foreground" />
    ),
    collection_updated: (
        <MaterialSymbolsDriveFileRenameOutlineOutlineRounded className="text-muted-foreground" />
    ),
    collection_deleted: (
        <MaterialSymbolsCloseRounded className="text-[#d93036]" />
    ),
};

const getCommentLink = (
    content_type: API.ContentType,
    slug: string,
    comment_reference: string,
) => {
    return `/comments/${content_type}/${slug}/${comment_reference}`;
};

const getCollectionLink = (collection_id: string) => {
    return `/collections/${collection_id}`;
};

const getEditLink = (edit_id: number) => {
    return `/edit/${edit_id}`;
};

const getInitialData = (
    moderation: API.Moderation<
        | API.ModerationEditData
        | API.ModerationEditUpdateData
        | API.ModerationCommentData
        | API.ModerationCollectionData
        | API.ModerationCollectionUpdateData
    >,
) => {
    return {
        target_type: moderation.target_type,
        title: TITLES[moderation.target_type],
        icon: ICONS[moderation.target_type],
        username: moderation.data.username,
        reference: moderation.reference,
        created: moderation.created,
    };
};

const commentHidden = (
    moderation: API.Moderation<API.ModerationCommentData>,
): Hikka.ModerationLog => {
    const { content_slug, content_type, comment_path } = moderation.data;

    return {
        ...getInitialData(moderation),
        href: getCommentLink(content_type, content_slug, comment_path),
        href_text: HREF_TEXT[moderation.target_type],
        after_text: 'користувача',
    };
};

const editAction = (
    moderation: API.Moderation<API.ModerationEditData>,
): Hikka.ModerationLog => {
    const { edit_id } = moderation.data;

    return {
        ...getInitialData(moderation),
        href: getEditLink(edit_id),
        href_text: `#${edit_id}`,
    };
};

const editUpdated = (
    moderation: API.Moderation<API.ModerationEditUpdateData>,
): Hikka.ModerationLog => {
    const { edit_id } = moderation.data;

    return {
        ...getInitialData(moderation),
        href: getEditLink(edit_id),
        href_text: `#${edit_id}`,
    };
};

const collectionDeleted = (
    moderation: API.Moderation<API.ModerationCollectionData>,
): Hikka.ModerationLog => {
    const { collection_id } = moderation.data;

    return {
        ...getInitialData(moderation),
        href: getCollectionLink(collection_id),
        href_text: HREF_TEXT[moderation.target_type],
    };
};

const collectionUpdated = (
    moderation: API.Moderation<API.ModerationCollectionUpdateData>,
): Hikka.ModerationLog => {
    const { collection_id } = moderation.data;

    return {
        ...getInitialData(moderation),
        href: getCollectionLink(collection_id),
        href_text: HREF_TEXT[moderation.target_type],
    };
};

export const convertModerationLog = (
    moderation: API.Moderation<
        | API.ModerationEditData
        | API.ModerationEditUpdateData
        | API.ModerationCommentData
        | API.ModerationCollectionData
        | API.ModerationCollectionUpdateData
    >,
): Hikka.ModerationLog => {
    switch (moderation.target_type) {
        case 'edit_accepted':
        case 'edit_denied':
            return editAction(
                moderation as API.Moderation<API.ModerationEditData>,
            );
        case 'edit_updated':
            return editUpdated(
                moderation as API.Moderation<API.ModerationEditUpdateData>,
            );
        case 'comment_hidden':
            return commentHidden(
                moderation as API.Moderation<API.ModerationCommentData>,
            );
        case 'collection_deleted':
            return collectionDeleted(
                moderation as API.Moderation<API.ModerationCollectionData>,
            );
        case 'collection_updated':
            return collectionUpdated(
                moderation as API.Moderation<API.ModerationCollectionUpdateData>,
            );
    }
};
