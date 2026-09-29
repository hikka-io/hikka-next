import { type FC, type ReactElement, type ReactNode, useState } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
    ResponsiveModalTrigger,
} from '@/components/ui/responsive-modal';

import ClearFiltersFooter from './clear-filters-footer';

type Props = {
    children: ReactElement;
    body: ReactNode;
    footer?: ReactNode;
};

const FiltersModal: FC<Props> = ({ children, body, footer }) => {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveModal
            type="sheet"
            mobile="page"
            open={open}
            onOpenChange={setOpen}
        >
            <ResponsiveModalTrigger render={children} />
            <ResponsiveModalContent className="md:max-w-xl" title="Фільтри">
                {body}
                <ResponsiveModalFooter>
                    {footer ?? (
                        <ClearFiltersFooter
                            className="w-full"
                            onDone={() => setOpen(false)}
                        />
                    )}
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default FiltersModal;
