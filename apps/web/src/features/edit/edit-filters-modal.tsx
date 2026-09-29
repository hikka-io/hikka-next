import { type ReactElement, useState } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
    ResponsiveModalTrigger,
} from '@/components/ui/responsive-modal';
import { ClearFiltersFooter } from '@/features/filters';

import { EditFiltersBody } from './edit-filters';

type Props = {
    children?: ReactElement;
};

const EditFiltersModal = ({ children }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveModal
            type="sheet"
            mobile="page"
            open={open}
            onOpenChange={setOpen}
        >
            <ResponsiveModalTrigger
                render={
                    children || (
                        <Button variant="outline" size="sm">
                            <AntDesignFilterFilled />
                            Фільтри
                        </Button>
                    )
                }
            />
            <ResponsiveModalContent className="md:max-w-xl" title="Фільтри">
                <EditFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />
                <ResponsiveModalFooter>
                    <ClearFiltersFooter
                        className="w-full"
                        onDone={() => setOpen(false)}
                    />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default EditFiltersModal;
