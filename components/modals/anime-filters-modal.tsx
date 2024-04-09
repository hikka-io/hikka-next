import * as React from 'react';
import { ReactNode } from 'react';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import Filters from '@/components/filters/anime-filters';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

interface Props {
    type: 'anime' | 'watchlist';
    children?: ReactNode;
}

const Component = ({ type, children }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon">
                        <AntDesignFilterFilled />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent
                side="left"
                className="flex !max-w-lg flex-col gap-0 pb-0"
            >
                <SheetHeader className="pb-4">
                    <SheetTitle>Фільтри</SheetTitle>
                </SheetHeader>
                <Separator className="-mx-6 w-auto" />
                <Filters type={type} className="-mx-6 px-6" />
            </SheetContent>
        </Sheet>
    );
};

export default Component;
