import { ContentTypeEnum } from '@hikka/client';
import { FC } from 'react';

import ContentArticles from '@/features/articles/article-view/content-articles/content-articles';
import Comments from '@/features/comments/comment-list.component';
import Followings from '@/features/followings/followings.component';
import Franchise from '@/features/franchise/franchise.component';
import Actions from '@/features/manga/manga-view/actions/actions.component';
import Characters from '@/features/manga/manga-view/characters/characters.component';
import Cover from '@/features/manga/manga-view/cover.component';
import Description from '@/features/manga/manga-view/description.component';
import Details from '@/features/manga/manga-view/details/details.component';
import Links from '@/features/manga/manga-view/links/links.component';
import ReadStats from '@/features/manga/manga-view/read-stats/read-stats.component';
import Staff from '@/features/manga/manga-view/staff.component';
import Title from '@/features/manga/manga-view/title.component';

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
                <Franchise content_type={ContentTypeEnum.MANGA} />
                <Staff />
            </div>

            <div className="flex flex-col gap-12 lg:col-span-1">
                <Details className="hidden lg:flex" />
                <ReadStats />
                <Followings content_type={ContentTypeEnum.MANGA} />
                <ContentArticles content_type={ContentTypeEnum.MANGA} />
                <Links />
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
