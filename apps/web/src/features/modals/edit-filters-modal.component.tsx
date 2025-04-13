import { ReactNode } from 'react';

import AntDesignFilterFilled from '../../components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '../../components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '../../components/ui/drawer';
import { Separator } from '../../components/ui/separator';
import Filters from '../filters/edit-filters.component';

interface Props {
    children?: ReactNode;
}

const Component = ({ children }: Props) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon">
                        <AntDesignFilterFilled />
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent className="h-[90dvh]">
                <DrawerHeader>
                    <DrawerTitle>Фільтри</DrawerTitle>
                </DrawerHeader>
                <Separator />
                <Filters className="px-6" />
            </DrawerContent>
        </Drawer>
    );
};

export default Component;
