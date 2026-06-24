import type { ReactNode } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import Filters from './schedule-filters';

type Props = {
    children?: ReactNode;
};

const ScheduleFiltersModal = ({ children }: Props) => {
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

export default ScheduleFiltersModal;
