'use client';

import * as React from 'react';
import { ReactNode } from 'react';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import Filters from '@/components/filters/filters';
import { Button } from '@/components/ui/button';
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
                className="!max-w-lg flex flex-col pb-0 gap-0"
            >
                <SheetHeader>
                    <SheetTitle>Фільтри</SheetTitle>
                </SheetHeader>
                <hr className="h-[1px] w-auto -mx-6 bg-border mt-4" />
                <Filters type={type} className="px-6 -mx-6" />
            </SheetContent>
        </Sheet>
    );
};

export default Component;
