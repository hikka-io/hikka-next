import { ContentTypeEnum } from '@hikka/client';
import { FC, ReactNode } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';

import ReadFilters from '@/features/filters/read-filters.component';
import NavBar from '@/features/manga/manga-list-navbar/manga-list-navbar.component';

interface Props {
    children: ReactNode;
}

const MangaListLayout: FC<Props> = async ({ children }) => {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог манґи</HeaderTitle>
                </Header>
                <NavBar />
                {children}
            </Block>
            <div className="sticky top-20 order-1 hidden w-full opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                <ReadFilters
                    content_type={ContentTypeEnum.MANGA}
                    sort_type="manga"
                />
            </div>
        </div>
    );
};

export default MangaListLayout;
