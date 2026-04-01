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

import { ScheduleFilters as Filters } from '@/features/schedule';

interface Props {
    children?: ReactNode;
}

const Component = ({ children }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon">
                        <AntDesignFilterFilled />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="h-[90dvh]">
                <SheetHeader>
                    <SheetTitle>Фільтри</SheetTitle>
                </SheetHeader>
                <Filters />
            </SheetContent>
        </Sheet>
    );
};

export default Component;
