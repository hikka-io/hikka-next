import { ContentTypeEnum } from '@hikka/client';
import { FC, ReactNode } from 'react';

import { CommentList as Comments } from '@/features/comments';

import ContentActions from './actions';
import ContentArticles from './articles';
import ContentCharacters from './characters';
import { Collections } from './collections';
import ContentStats from './content-stats';
import ContentCover from './cover';
import ContentDescription from './description';
import ContentDetails from './details';
import { Followings } from './followings';
import Franchise from './franchise';
import ContentLinks from './links';
import ContentScores from './scores';
import ContentStaff from './staff';
import ContentTitle from './title';

interface Props {
    contentType:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
    slug: string;
    afterDescription?: ReactNode;
    afterFranchise?: ReactNode;
    jsonLd?: ReactNode;
}

const ContentDetailPage: FC<Props> = ({
    contentType,
    slug,
    afterDescription,
    afterFranchise,
    jsonLd,
}) => {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
            {jsonLd}
            <div className="flex flex-col gap-4 lg:col-span-1">
                <ContentCover content_type={contentType} />
                <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <ContentActions content_type={contentType} />
                </div>
            </div>
            <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-8">
                <ContentTitle content_type={contentType} />
                <ContentScores
                    className="lg:hidden"
                    content_type={contentType}
                />
                <ContentDescription content_type={contentType} />
                {afterDescription}

                <ContentDetails
                    className="lg:hidden"
                    content_type={contentType}
                />
                <ContentCharacters content_type={contentType} />
                <Franchise content_type={contentType} />
                {afterFranchise}
                <ContentStaff content_type={contentType} />
                <div className="order-last lg:order-0">
                    <Comments preview slug={slug} content_type={contentType} />
                </div>
            </div>

            <div className="flex flex-col gap-8 lg:col-span-1">
                <ContentScores
                    className="hidden lg:flex"
                    content_type={contentType}
                />
                <ContentDetails
                    className="hidden lg:flex"
                    content_type={contentType}
                />
                <ContentStats content_type={contentType} />
                <Followings content_type={contentType} />
                <ContentArticles content_type={contentType} />
                <Collections content_type={contentType} />
                <ContentLinks content_type={contentType} />
            </div>
        </div>
    );
};

export default ContentDetailPage;
