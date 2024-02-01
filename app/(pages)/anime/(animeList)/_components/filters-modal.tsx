'use client';

import * as React from 'react';

import AntDesignFilterFilled from '~icons/ant-design/filter-filled';
import Filters from './filters/filters';
import { Button } from '@/app/_components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/app/_components/ui/sheet';


const Component = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="outline" size="icon"><AntDesignFilterFilled /></Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="!max-w-lg flex flex-col pb-0 gap-0"
            >
                <SheetHeader>
                    <SheetTitle>Фільтри</SheetTitle>
                </SheetHeader>
                <hr className="h-[1px] w-auto -mx-6 bg-border mt-4" />
                <div className="flex-1 overflow-y-scroll w-auto h-full px-6 pt-4 -mx-6">
                    <Filters />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Component;