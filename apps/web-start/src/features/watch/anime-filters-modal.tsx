import { ContentTypeEnum } from '@hikka/client';
import { ReactNode } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

import { AnimeFilters } from '@/features/watch';

interface Props {
    sort_type: 'anime' | 'watch';
    children?: ReactNode;
}

const AnimeFiltersModal = ({ sort_type, children }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm">
                        <AntDesignFilterFilled />
                        Фільтри
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Фільтри</SheetTitle>
                </SheetHeader>
                <AnimeFilters
                    content_type={ContentTypeEnum.ANIME}
                    className="overflow-hidden"
                    sort_type={sort_type}
                />
            </SheetContent>
        </Sheet>
    );
};

export default AnimeFiltersModal;
