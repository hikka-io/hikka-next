import { ContentTypeEnum } from '@hikka/client';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

import AntDesignFilterFilled from '../../components/icons/ant-design/AntDesignFilterFilled';
import AnimeFilters from '../filters/anime-filters.component';

interface Props {
    sort_type: 'anime' | 'watch';
    children?: ReactNode;
}

const AnimeFiltersModal = ({ sort_type, children }: Props) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon">
                        <AntDesignFilterFilled />
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent className="h-[90dvh]">
                <DrawerHeader>
                    <DrawerTitle>Фільтри</DrawerTitle>
                </DrawerHeader>
                <Separator className="w-auto" />
                <AnimeFilters
                    content_type={ContentTypeEnum.ANIME}
                    className="px-6"
                    sort_type={sort_type}
                />
            </DrawerContent>
        </Drawer>
    );
};

export default AnimeFiltersModal;
