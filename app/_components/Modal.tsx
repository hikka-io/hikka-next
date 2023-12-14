'use client';

import clsx from 'clsx';
import React, { ForwardedRef, PropsWithChildren, ReactNode } from 'react';
import AntDesignCloseOutlined from '~icons/ant-design/close-outlined';

import { Modal, ModalBackdropSlotProps } from '@mui/base';
import { animated, useTransition } from '@react-spring/web';

interface Props extends PropsWithChildren {
    className?: string;
    id: string;
    open: boolean;
    onDismiss: () => void;
    boxClassName?: string;
    title?: string;
    disableHeader?: boolean;
    noEscape?: boolean;
}

const Backdrop = React.forwardRef(
    (
        props: ModalBackdropSlotProps & { className?: string },
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const { open, className, ...other } = props;
        const transition = useTransition(open, {
            from: {
                opacity: 0,
            },
            enter: { opacity: 1 },
            leave: { opacity: 0 },
            config: {
                duration: 50,
            },
        });

        return transition(
            (style, item) =>
                item && (
                    <animated.div
                        style={style}
                        className={clsx(
                            { 'MuiBackdrop-open': open },
                            'fixed inset-0 -z-[1] bg-black/80',
                            className,
                        )}
                        ref={ref}
                        {...other}
                    />
                ),
        );
    },
);

const Component = ({
    className,
    boxClassName,
    open,
    id,
    children,
    onDismiss,
    title,
    noEscape,
    disableHeader,
}: Props) => {
    return (
        <Modal
            disableAutoFocus
            disableRestoreFocus
            open={open}
            className={clsx(
                'fixed inset-0 z-[1300] flex items-center justify-center',
                className,
            )}
            onClose={onDismiss}
            disableEscapeKeyDown={noEscape}
            slots={{ backdrop: Backdrop }}
        >
            <ModalContent in={open} className={boxClassName}>
                {!disableHeader && (
                    <div
                        className={clsx(
                            'flex w-full items-center justify-between gap-2 px-8 pt-8',
                            !title && 'absolute',
                        )}
                    >
                        {title ? <h3>{title}</h3> : <div />}
                        <button
                            onClick={onDismiss}
                            className="btn btn-sm btn-square btn-secondary btn-outline"
                        >
                            <AntDesignCloseOutlined />
                        </button>
                    </div>
                )}
                {children}
            </ModalContent>
        </Modal>
    );
};

interface FadeInProps {
    children: ReactNode;
    in?: boolean;
    className?: string;
    onEnter?: (arg1: unknown, arg2: boolean) => void;
    onExited?: (arg1: unknown, arg2: boolean) => void;
}

const ModalContent = React.forwardRef(function Fade(
    props: FadeInProps,
    ref: ForwardedRef<HTMLDivElement>,
) {
    const {
        in: open,
        children,
        className,
        onEnter,
        onExited,
        ...other
    } = props;
    const transition = useTransition(open, {
        from: {
            opacity: 0,
            transform: 'scale(0.95)',
        },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.9)' },
        config: {
            duration: 50,
        },
    });

    return transition(
        (style, item) =>
            item && (
                <animated.div
                    style={style}
                    className={clsx(
                        'modal-box relative transform-none',
                        'h-full max-h-none w-full sm:h-auto sm:max-h-[100%] sm:w-11/12 sm:max-w-3xl',
                        'border border-secondary',
                        'rounded-none sm:rounded-2xl',
                        className,
                    )}
                    ref={ref}
                    {...other}
                >
                    {children}
                </animated.div>
            ),
    );
});

export default Component;