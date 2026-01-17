import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import { ContentArticles } from '@/features/articles';
import { ContentCollections } from '@/features/collections';
import { CommentList as Comments } from '@/features/comments';
import {
    ContentActions as Actions,
    ContentCharacters as Characters,
    ContentCover as Cover,
    ContentDescription as Description,
    ContentDetails as Details,
    Franchise,
    ContentLinks as Links,
    ContentStaff as Staff,
    ContentStats as Stats,
    ContentTitle as Title,
} from '@/features/content';
import { Followings } from '@/features/modals';

interface Props {
    params: {
        slug: string;
    };
}

const MangaPage: FC<Props> = async (props) => {
    const params = await props.params;

    const { slug } = params;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-16">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <Cover content_type={ContentTypeEnum.MANGA} />
                <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <Actions content_type={ContentTypeEnum.MANGA} />
                </div>
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2">
                <Title content_type={ContentTypeEnum.MANGA} />
                <Description content_type={ContentTypeEnum.MANGA} />
                <Details
                    className="lg:hidden"
                    content_type={ContentTypeEnum.MANGA}
                />
                <Characters content_type={ContentTypeEnum.MANGA} />
                <Franchise content_type={ContentTypeEnum.MANGA} />
                <Staff content_type={ContentTypeEnum.MANGA} />
            </div>

            <div className="flex flex-col gap-12 lg:col-span-1">
                <Details
                    className="hidden lg:flex"
                    content_type={ContentTypeEnum.MANGA}
                />
                <Stats content_type={ContentTypeEnum.MANGA} />
                <Followings content_type={ContentTypeEnum.MANGA} />
                <ContentArticles content_type={ContentTypeEnum.MANGA} />
                <ContentCollections content_type={ContentTypeEnum.MANGA} />
                <Links content_type={ContentTypeEnum.MANGA} />
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2 lg:col-start-2">
                <Comments
                    preview
                    slug={slug}
                    content_type={ContentTypeEnum.MANGA}
                />
            </div>
        </div>
    );
};

export default MangaPage;
