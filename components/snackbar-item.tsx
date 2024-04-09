'use client';

import clsx from 'clsx';
import { CustomContentProps, SnackbarContent } from 'notistack';
import React, {
    ReactElement,
    SVGProps,
    forwardRef,
    memo,
    useEffect,
    useState,
} from 'react';
import EpSuccessFilled from '~icons/ep/success-filled';
import MaterialSymbolsErrorCircleRounded from '~icons/material-symbols/error-circle-rounded';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';
import MaterialSymbolsWarningRounded from '~icons/material-symbols/warning-rounded';

const icons: Record<
    'default' | 'error' | 'success' | 'warning' | 'info',
    ((props: SVGProps<SVGSVGElement>) => ReactElement) | null
> = {
    default: null,
    error: MaterialSymbolsErrorCircleRounded,
    success: EpSuccessFilled,
    warning: MaterialSymbolsWarningRounded,
    info: MaterialSymbolsInfoRounded,
};

const colors: Record<
    'default' | 'destructive' | 'success' | 'warning' | 'info',
    string
> = {
    default: 'bg-secondary text-secondary',
    destructive: 'bg-destructive text-destructive',
    success: 'bg-success text-success',
    warning: 'bg-warning text-warning',
    info: 'bg-info text-info',
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

const ThemeResponsiveSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
    (props, forwardedRef) => {
        const { message, variant, autoHideDuration } = props;

        const getVariantColor = () => {
            switch (variant) {
                case 'error':
                    return 'destructive';
                default:
                    return variant;
            }
        };

        return (
            <SnackbarContent
                ref={forwardedRef}
                className={clsx(
                    'flex h-full max-w-sm flex-nowrap items-center gap-4 rounded-md border border-secondary bg-background p-4 text-sm text-foreground shadow-md',
                )}
            >
                {icons[variant] !== null &&
                    icons[variant]!({
                        className: `text-${getVariantColor()} text-xl`,
                    })}
                <div className="flex-1">{message}</div>
                <div className="relative flex h-full items-end">
                    <div
                        className={clsx(
                            'absolute',
                            'h-full w-1 rounded-full opacity-30',
                            `bg-${getVariantColor()}`,
                        )}
                    />
                    <div
                        className={clsx(
                            'snackbar-timer h-full w-1 rounded-full',
                            `bg-${getVariantColor()}`,
                        )}
                    />
                </div>
            </SnackbarContent>
        );
    },
);

export default memo(ThemeResponsiveSnackbar);
