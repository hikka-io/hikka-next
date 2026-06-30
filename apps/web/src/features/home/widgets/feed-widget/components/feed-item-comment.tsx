import type { FC } from 'react';

import type { CommentResponseFeed, ContentTypeEnum } from '@hikka/api';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';
import { Link } from '@/utils/navigation';

type Props = {
    data: CommentResponseFeed;
};

// @hikka/api types `CommentResponseFeed.preview` as a loose `{ [key]: unknown }`.
type CommentPreview = {
    slug?: string;
};

const FeedItemComment: FC<Props> = ({ data }) => {
    if (!data.text) return null;

    const preview = data.preview as CommentPreview;
    const contentType = data.content_type as ContentTypeEnum;

    return (
        <TextExpand>
            <Link
                to={`/comments/${contentType}/${preview.slug}`}
                className="cursor-pointer"
            >
                <MDViewer className="text-[0.9375rem]" preview>
                    {data.text}
                </MDViewer>
            </Link>
        </TextExpand>
    );
};

export default FeedItemComment;
