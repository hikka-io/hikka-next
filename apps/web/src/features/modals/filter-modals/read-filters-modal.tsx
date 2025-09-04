import { ReadContentType } from '@hikka/client';
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

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { ReadFilters } from '@/features/filters';

interface Props {
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
    children?: ReactNode;
}

const AnimeFiltersModal = ({ sort_type, content_type, children }: Props) => {
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
                <Separator />
                <ReadFilters
                    content_type={content_type}
                    sort_type={sort_type}
                    className="px-6"
                />
            </DrawerContent>
        </Drawer>
    );
};

export default AnimeFiltersModal;
