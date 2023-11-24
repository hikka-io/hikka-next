'use client';

import React, {
    ForwardedRef,
    memo,
    PropsWithChildren,
    ReactNode,
    useRef,
} from 'react';
import clsx from 'clsx';
import AntDesignCloseOutlined from '~icons/ant-design/close-outlined';
import { Modal, ModalBackdropSlotProps } from '@mui/base';
import { animated, useSpring, useTransition } from '@react-spring/web';

interface Props extends PropsWithChildren {
    className?: string;
    id: string;
    open: boolean;
    onDismiss: () => void;
    boxClassName?: string;
    title?: string;
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
                            '-z-[1] fixed inset-0 bg-black/80',
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
}: Props) => {
    return (
        <Modal
            disableRestoreFocus
            open={open}
            className={clsx(
                'fixed z-[1300] inset-0 flex items-center justify-center',
                className,
            )}
            onClose={onDismiss}
            disableEscapeKeyDown={noEscape}
            slots={{ backdrop: Backdrop }}
        >
            <ModalContent in={open} className={boxClassName}>
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
                        'modal-box transform-none relative',
                        'w-full h-full max-h-none md:h-auto md:max-h-[100%] md:max-w-3xl md:w-11/12',
                        'border border-secondary',
                        'rounded-none lg:rounded-2xl',
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
