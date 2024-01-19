'use client';

import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { Popper, PopperProps } from '@mui/base/Popper';

interface Props extends PopperProps {
    open: boolean;
    onDismiss: () => void;
    id?: string;
}

const Component = (props: Props) => {
    const { open, onDismiss, children, id, ...etc } = props;

    if (!open) {
        return null;
    }

    return createPortal(
        <div role="presentation" className="fixed inset-0 z-[1300]">
            <div
                className="fixed inset-0 -z-[1] flex items-center justify-center bg-black/60"
                onClick={onDismiss}
            />
            <Popper role="menu" disablePortal id={id} open={open} {...etc}>
                <div className="mt-3 flex w-60 flex-col overflow-hidden rounded-lg border border-solid border-secondary bg-base-100 shadow-md">
                    {typeof children !== 'function' && children}
                </div>
            </Popper>
        </div>,
        document.body,
    );
};

export default Component;
