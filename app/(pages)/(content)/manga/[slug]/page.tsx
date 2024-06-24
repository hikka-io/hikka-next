import { FC } from 'react';

import Characters from '@/features/manga/manga-view/characters/characters.component';
import Description from '@/features/manga/manga-view/description.component';
import Details from '@/features/manga/manga-view/details/details.component';
import Franchise from '@/features/manga/manga-view/franchise.component';
import Links from '@/features/manga/manga-view/links/links.component';
import ReadStats from '@/features/manga/manga-view/read-stats/read-stats.component';
import Staff from '@/features/manga/manga-view/staff.component';

interface Props {
    params: {
        slug: string;
    };
}

const MangaPage: FC<Props> = async ({ params }) => {
    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_33%] lg:gap-16 xl:grid-cols-[1fr_30%]">
            <div className="relative order-2 flex flex-col gap-12 lg:order-1">
                <Description />
                <Characters />
                <Franchise />
                <Staff />
                <div className="flex flex-col gap-12 lg:hidden">
                    <ReadStats />
                    <Links />
                </div>
            </div>
            <div className="order-1 flex flex-col gap-12 lg:order-2">
                <Details />
                <div className="hidden lg:flex lg:flex-col lg:gap-12">
                    <ReadStats />
                    <Links />
                </div>
            </div>
        </div>
    );
};

export default MangaPage;
