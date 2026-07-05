import type { FC, MouseEvent } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { CommentResponseFeed, ContentTypeEnum } from '@hikka/api';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';

type Props = {
    data: CommentResponseFeed;
};

// @hikka/api types `CommentResponseFeed.preview` as a loose `{ [key]: unknown }`.
type CommentPreview = {
    slug?: string;
};

const FeedItemComment: FC<Props> = ({ data }) => {
    const navigate = useNavigate();

    if (!data.text) return null;

    const preview = data.preview as CommentPreview;
    const contentType = data.content_type as ContentTypeEnum;

    const handleNavigate = (event: MouseEvent<HTMLDivElement>) => {
        // Spoiler reveals, links, and mentions inside the comment handle
        // their own clicks; only empty-area clicks open the comment page.
        if ((event.target as HTMLElement).closest('a, button')) return;

        navigate({ to: `/comments/${contentType}/${preview.slug}` });
    };

    return (
        <TextExpand>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: click is a supplementary shortcut; primary navigation is the footer comments link. */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: click is a supplementary shortcut; primary navigation is the footer comments link. */}
            <div className="cursor-pointer" onClick={handleNavigate}>
                <MDViewer className="text-[0.9375rem]">{data.text}</MDViewer>
            </div>
        </TextExpand>
    );
};

export default FeedItemComment;
