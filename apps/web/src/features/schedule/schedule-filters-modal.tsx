import { type ReactNode, useState } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalTrigger,
} from '@/components/ui/responsive-modal';

import Filters from './schedule-filters';

type Props = {
    children?: ReactNode;
};

const ScheduleFiltersModal = ({ children }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveModal
            type="sheet"
            mobile="page"
            open={open}
            onOpenChange={setOpen}
        >
            <ResponsiveModalTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon">
                        <AntDesignFilterFilled />
                    </Button>
                )}
            </ResponsiveModalTrigger>
            <ResponsiveModalContent
                className="md:h-[90dvh] md:max-w-sm!"
                title="Фільтри"
            >
                <Filters />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default ScheduleFiltersModal;
