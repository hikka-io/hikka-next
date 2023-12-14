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
            <Popper
                className={clsx('z-50 hidden lg:block', popperClassName)}
                {...props}
                onMouseOver={() => setOpen(true)}
                onMouseOut={() => setOpen(false)}
                open={openProp ? openProp : open}
                anchorEl={anchorRef.current}
            >
                <div
                    className={clsx(
                        'z-50 rounded-lg border border-solid border-secondary bg-base-100 shadow-md',
                        className,
                    )}
                >
                    {data}
                </div>
            </Popper>
        </>
    );
};

export default memo(Component);