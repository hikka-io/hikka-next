import { type FC, type ReactElement, type ReactNode, useState } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
    ResponsiveModalTrigger,
} from '@/components/ui/responsive-modal';

import ClearFiltersFooter from './clear-filters-footer';

type Props = {
    body: ReactNode;
    footer?: ReactNode;
} & (
    | { children: ReactElement; open?: never; onOpenChange?: never }
    | {
          children?: never;
          open: boolean;
          onOpenChange: (open: boolean) => void;
      }
);

const FiltersModal: FC<Props> = ({
    children,
    body,
    footer,
    open: controlledOpen,
    onOpenChange,
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    return (
        <ResponsiveModal
            type="sheet"
            mobile="page"
            open={open}
            onOpenChange={setOpen}
        >
            {children && <ResponsiveModalTrigger render={children} />}
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
