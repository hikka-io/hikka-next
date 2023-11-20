'use client';

import React, {
    memo,
    PropsWithChildren,
    SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import AntDesignCloseOutlined from '~icons/ant-design/close-outlined';

interface Props extends PropsWithChildren {
    className?: string;
    id: string;
    open: boolean;
    onDismiss: () => void;
    boxClassName?: string;
    title?: string;
    noEscape?: boolean;
}

const Component = ({
    className,
    boxClassName,
    open,
    id,
    children,
    onDismiss,
    title,
    noEscape,
    ...props
}: Props) => {
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLDialogElement>(null);

    const handleOnCancel = (e: SyntheticEvent<HTMLDialogElement, Event>) => {
        e.preventDefault();
        !noEscape && onDismiss();
    };

    useEffect(() => {
        if (ref?.current) {
            if (open) {
                ref.current.showModal();
            } else {
                ref.current.close();
            }
        }
    }, [open]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return createPortal(
        <dialog
            ref={ref}
            className={clsx('modal', 'modal-bottom md:modal-middle', className)}
            id={id}
            onCancel={(e) => handleOnCancel(e)}
            {...props}
        >
            <div
                className={clsx(
                    'modal-box ',
                    'w-full h-full max-h-none md:h-auto md:max-h-[100%] md:max-w-3xl md:w-11/12',
                    'border border-secondary',
                    'rounded-none lg:rounded-2xl',
                    boxClassName,
                )}
            >
                <div
                    className={clsx(
                        'flex justify-between items-center pt-8 px-8 w-full gap-2',
                        !title && 'absolute',
                    )}
                >
                    <h3>{title}</h3>
                    <button
                        onClick={onDismiss}
                        className="btn btn-outline btn-secondary btn-square"
                    >
                        <AntDesignCloseOutlined />
                    </button>
                </div>
                {children}
            </div>
            <form
                onSubmit={(e) => e.preventDefault()}
                method="dialog"
                className="modal-backdrop"
            >
                <button onClick={onDismiss}>Close</button>
            </form>
        </dialog>,
        document.body,
    );
};

export default memo(Component);
