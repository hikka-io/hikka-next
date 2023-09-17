'use client';

import React, { memo, PropsWithChildren, useCallback, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';

interface Props extends PropsWithChildren {
    className?: string;
    id: string;
    isRoute?: boolean;
    onDismiss?: () => void;
}

const Component = ({
    className,
    id,
    children,
    isRoute,
    onDismiss,
    ...props
}: Props) => {
    const router = useRouter();

    const onDismissRoute = useCallback(() => {
        // @ts-ignore
        (window[id] as HTMLDialogElement).close();

        setTimeout(() => router.back(), 100);
    }, [router]);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape')
                isRoute
                    ? onDismissRoute()
                    : onDismiss !== undefined
                    ? onDismiss()
                    : undefined;
        },
        [onDismissRoute, onDismiss],
    );

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);

    useEffect(() => {
        // @ts-ignore
        isRoute && (window[id] as HTMLDialogElement).showModal();
    }, []);

    return (
        <dialog className={clsx('modal', className)} id={id} {...props}>
            <form onSubmit={(e) => e.preventDefault()} method="dialog" className="modal-box w-11/12 max-w-2xl">
                <button
                    onClick={
                        isRoute
                            ? onDismissRoute
                            : onDismiss !== undefined
                            ? onDismiss
                            : undefined
                    }
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    ✕
                </button>
                {children}
            </form>
            <form onSubmit={(e) => e.preventDefault()} method="dialog" className="modal-backdrop">
                <button
                    onClick={
                        isRoute
                            ? onDismissRoute
                            : onDismiss !== undefined
                            ? onDismiss
                            : undefined
                    }
                >
                    Close
                </button>
            </form>
        </dialog>
    );
};

export default memo(Component);
