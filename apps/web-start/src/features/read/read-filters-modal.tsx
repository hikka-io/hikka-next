import { ReadContentType } from '@hikka/client';
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

import { ReadFilters } from '@/features/read';

interface Props {
    content_type: ReadContentType;
    sort_type: 'manga' | 'novel' | 'read';
    children?: ReactNode;
}

const ReadFiltersModal = ({ sort_type, content_type, children }: Props) => {
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
                <ReadFilters
                    content_type={content_type}
                    sort_type={sort_type}
                    className="overflow-hidden"
                />
            </SheetContent>
        </Sheet>
    );
};

export default ReadFiltersModal;
