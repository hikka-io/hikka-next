import { FC, ReactNode } from 'react';

import Block from '@/components/ui/block';

import ReadFilters from '@/features/filters/read-filters.component';
import NavBar from '@/features/novel/novel-list-navbar/novel-list-navbar.component';

interface Props {
    children: ReactNode;
}

const NovelListLayout: FC<Props> = async ({ children }) => {
    return (
        <div>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                <Block>
                    <NavBar />
                    {children}
                </Block>
                <div className="sticky top-20 order-1 hidden w-full opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                    <ReadFilters content_type="novel" sort_type="novel" />
                </div>
            </div>
        </div>
    );
};

export default NovelListLayout;
