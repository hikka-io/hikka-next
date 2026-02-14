import { ContentTypeEnum } from '@hikka/client';
import { FC, ReactNode } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';

import { ReadFilters } from '@/features/filters';
import { MangaListNavbar as NavBar } from '@/features/manga';

interface Props {
    children: ReactNode;
}

const MangaListLayout: FC<Props> = async ({ children }) => {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог манґи</HeaderTitle>
                </Header>
                <NavBar />
                {children}
            </Block>
            <div className="sticky top-20 order-1 hidden w-full max-h-[calc(100vh-9rem)] rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden lg:order-2 lg:flex">
                <ReadFilters
                    content_type={ContentTypeEnum.MANGA}
                    sort_type="manga"
                />
            </div>
        </div>
    );
};

export default MangaListLayout;
