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

import { EditFilters } from '@/features/edit';

interface Props {
    children?: ReactNode;
}

const EditFiltersModal = ({ children }: Props) => {
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
            <SheetContent className="h-[90dvh]">
                <SheetHeader>
                    <SheetTitle>Фільтри</SheetTitle>
                </SheetHeader>
                <EditFilters className="overflow-hidden" />
            </SheetContent>
        </Sheet>
    );
};

export default EditFiltersModal;
