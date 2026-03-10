import Link from 'next/link';
import { FC } from 'react';

import { CommentResponse } from '@hikka/client';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';

import FeedItemContentPreview from './feed-item-content-preview';

interface Props {
    data: CommentResponse;
}

const FeedItemComment: FC<Props> = ({ data }) => {
    return (
        <div className="flex flex-col gap-4 p-4 py-0">
            <FeedItemContentPreview
                contentType={data.content_type}
                slug={data.preview.slug}
                title={data.preview.title}
            />
            {data.text && (
                <TextExpand>
                    <Link
                        href={`/comments/${data.content_type}/${data.preview.slug}`}
                        className="cursor-pointer"
                    >
                        <MDViewer
                            className="text-[0.9375rem]"
                            preview
                        >
                            {data.text}
                        </MDViewer>
                    </Link>
                </TextExpand>
            )}
        </div>
    );
};

export default FeedItemComment;
