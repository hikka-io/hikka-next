'use client';

import { PropsWithChildren } from 'react';
import {Popper, PopperProps} from '@mui/base/Popper';
import { createPortal } from 'react-dom';

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
        <div role="presentation" className="fixed z-[1300] inset-0">
            <div
                className="fixed flex items-center justify-center inset-0 bg-black/60 -z-[1]"
                onClick={onDismiss}
            />
            <Popper
                role="menu"
                disablePortal
                id={id}
                open={open}
                {...etc}
            >
                <div className="mt-3 flex overflow-hidden flex-col rounded-lg w-60 border border-solid border-secondary bg-base-100 shadow-md">
                    {typeof children !== "function" && children}
                </div>
            </Popper>
        </div>,
        document.body,
    );
};

export default Component;
