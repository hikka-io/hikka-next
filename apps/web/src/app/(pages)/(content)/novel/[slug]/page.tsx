import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import { ContentArticles } from '@/features/articles';
import { CommentList as Comments } from '@/features/comments';
import { Franchise } from '@/features/franchise';
import { Followings } from '@/features/modals';
import {
    NovelActions as Actions,
    NovelCharacters as Characters,
    NovelCover as Cover,
    NovelDescription as Description,
    NovelDetails as Details,
    NovelLinks as Links,
    NovelReadStats as ReadStats,
    NovelStaff as Staff,
    NovelTitle as Title,
} from '@/features/novel';

interface Props {
    params: {
        slug: string;
    };
}

const NovelPage: FC<Props> = async (props) => {
    const params = await props.params;

    const { slug } = params;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-16">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <Cover />
                <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                    <Actions />
                </div>
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2">
                <Title />
                <Description />
                <Details className="lg:hidden" />
                <Characters />
                <Franchise content_type={ContentTypeEnum.NOVEL} />
                <Staff />
            </div>

            <div className="flex flex-col gap-12 lg:col-span-1">
                <Details className="hidden lg:flex" />
                <ReadStats />
                <Followings content_type={ContentTypeEnum.NOVEL} />
                <ContentArticles content_type={ContentTypeEnum.NOVEL} />
                <Links />
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2 lg:col-start-2">
                <Comments
                    preview
                    slug={slug}
                    content_type={ContentTypeEnum.NOVEL}
                />
            </div>
        </div>
    );
};

export default NovelPage;
