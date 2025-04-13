import { FC } from 'react';

import ContentNews from '../../../../../features/articles/article-view/content-articles/content-articles';
import Followings from '../../../../../features/followings/followings.component';
import Franchise from '../../../../../features/franchise/franchise.component';
import Characters from '../../../../../features/novel/novel-view/characters/characters.component';
import Description from '../../../../../features/novel/novel-view/description.component';
import Details from '../../../../../features/novel/novel-view/details/details.component';
import Links from '../../../../../features/novel/novel-view/links/links.component';
import ReadStats from '../../../../../features/novel/novel-view/read-stats/read-stats.component';
import Staff from '../../../../../features/novel/novel-view/staff.component';

interface Props {
    params: {
        slug: string;
    };
}

const NovelPage: FC<Props> = async (props) => {
    const params = await props.params;
    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_33%] lg:gap-16 xl:grid-cols-[1fr_30%]">
            <div className="relative order-2 flex flex-col gap-12 lg:order-1">
                <Description />
                <Characters />
                <Franchise content_type="novel" />
                <Staff />
                <div className="flex flex-col gap-12 lg:hidden">
                    <ReadStats />
                    <Followings content_type="novel" key="followings" />
                    <ContentNews content_type="novel" />
                    <Links />
                </div>
            </div>
            <div className="order-1 flex flex-col gap-12 lg:order-2">
                <Details />
                <div className="hidden lg:flex lg:flex-col lg:gap-12">
                    <ReadStats />
                    <Followings content_type="novel" key="followings" />
                    <ContentNews content_type="novel" />
                    <Links />
                </div>
            </div>
        </div>
    );
};

export default NovelPage;
