import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import { default as ContentArticles } from '@/features/articles/article-view/content-articles/content-articles';
import { CommentList as Comments } from '@/features/comments';
import { Franchise } from '@/features/franchise';
import { Followings } from '@/features/modals';
import Actions from '@/features/novel/novel-view/actions/actions';
import Characters from '@/features/novel/novel-view/characters/characters';
import Cover from '@/features/novel/novel-view/cover';
import Description from '@/features/novel/novel-view/description';
import Details from '@/features/novel/novel-view/details/details';
import Links from '@/features/novel/novel-view/links/links';
import ReadStats from '@/features/novel/novel-view/read-stats/read-stats';
import Staff from '@/features/novel/novel-view/staff';
import Title from '@/features/novel/novel-view/title';

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
