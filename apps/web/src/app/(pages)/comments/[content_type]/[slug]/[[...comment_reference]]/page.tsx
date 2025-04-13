import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import ContentHeader from '../../../../../../features/comments/comment-content-header.component';
import Comments from '../../../../../../features/comments/comment-list.component';
import {
    getContent,
    key,
    prefetchContent,
} from '../../../../../../features/comments/use-content';
import { prefetchCommentThread } from '../../../../../../services/hooks/comments/use-comment-thread';
import { prefetchComments } from '../../../../../../services/hooks/comments/use-comments';
import { convertTitle } from '../../../../../../utils/adapters/convert-title';
import _generateMetadata from '../../../../../../utils/generate-metadata';
import getQueryClient from '../../../../../../utils/get-query-client';

export interface MetadataProps {
    params: { slug: string; content_type: API.ContentType };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const content = await getContent({
        content_type: params.content_type,
        slug: params.slug,
    });

    const coverted = convertTitle({ data: content, titleLanguage: 'title_ua' });

    return _generateMetadata({
        title: `Коментарі / ${coverted.title}`,
    });
}

interface Props {
    params: {
        content_type: API.ContentType;
        slug: string;
        comment_reference: string[];
    };
}

const CommentsPage: FC<Props> = async (props) => {
    const params = await props.params;
    const queryClient = await getQueryClient();

    const comment_reference =
        params.comment_reference && params.comment_reference[0];

    await prefetchContent(params);

    const content = queryClient.getQueryData(key(params));

    if (!content) {
        return permanentRedirect('/');
    }

    !comment_reference &&
        (await prefetchComments({
            slug: params.slug,
            content_type: params.content_type,
        }));

    comment_reference &&
        (await prefetchCommentThread({ reference: comment_reference }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                <div className="flex flex-col gap-16">
                    <ContentHeader
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                    <Comments
                        comment_reference={comment_reference}
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default CommentsPage;
