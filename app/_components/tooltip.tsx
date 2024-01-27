'use client';

import clsx from 'clsx';
import * as React from 'react';
import {
    PropsWithChildren,
    ReactElement,
    ReactNode,
    cloneElement,
    memo,
    useRef,
    useState,
} from 'react';

import { Popper, PopperPlacementType, PopperProps } from '@mui/base/Popper';
import { Popover, PopoverAnchor, PopoverContent } from '@/app/_components/ui/popover';

interface Props extends PropsWithChildren {
    popperClassName?: string;
    data: ReactNode;
    open?: boolean;
    className?: string;
    placement?: PopperPlacementType;
}

const Component = ({
    popperClassName,
    className,
    data,
    children,
    open: openProp,
    ...props
}: Props) => {
    const anchorRef = useRef<HTMLElement>(null);
    const [open, setOpen] = useState(false);

    return (
        <>
            {cloneElement(children as ReactElement, {
                ref: anchorRef,
                onMouseOver: () => setOpen(true),
                onMouseOut: () => setOpen(false),
            })}
            <Popover
                {...props}
                open={open}
            >
                <PopoverContent className={clsx('z-50 hidden lg:block', popperClassName)}>
                    {data}
                </PopoverContent>

            </Popover>
        </>
    );
};

export default Component;
