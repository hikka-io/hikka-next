import { ContentTypeEnum } from '@hikka/client';
import { ReactNode } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import { AnimeFilters } from '@/features/watch';

interface Props {
    sort_type: 'anime' | 'watch';
    children?: ReactNode;
}

const AnimeFiltersModal = ({ sort_type, children }: Props) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm">
                        <AntDesignFilterFilled />
                        Фільтри
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent className="h-[90dvh]">
                <DrawerHeader>
                    <DrawerTitle>Фільтри</DrawerTitle>
                </DrawerHeader>
                <AnimeFilters
                    content_type={ContentTypeEnum.ANIME}
                    className="overflow-hidden"
                    sort_type={sort_type}
                />
            </DrawerContent>
        </Drawer>
    );
};

export default AnimeFiltersModal;
