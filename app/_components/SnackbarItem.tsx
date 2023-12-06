'use client';
import React, {
    forwardRef, memo,
    ReactElement,
    SVGProps,
    useEffect,
    useState,
} from 'react';
import clsx from 'clsx';
import { CustomContentProps, SnackbarContent } from 'notistack';
import MaterialSymbolsWarningRounded from '~icons/material-symbols/warning-rounded'
import EpSuccessFilled from '~icons/ep/success-filled'
import MaterialSymbolsErrorCircleRounded from '~icons/material-symbols/error-circle-rounded'
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded'

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
    'default' | 'error' | 'success' | 'warning' | 'info',
    string
> = {
    default: 'bg-secondary text-secondary',
    error: 'bg-error text-error',
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

        return (
            <SnackbarContent
                ref={forwardedRef}
                className={clsx(
                    'flex gap-4 h-full flex-nowrap bg-base-100 border border-secondary text-sm text-base-content items-center p-4 max-w-sm rounded-md shadow-md',
                )}
            >
                {icons[variant] !== null &&
                    icons[variant]!({ className: `text-${variant} text-xl` })}
                <div className="flex-1">{message}</div>
                <div className="h-full flex items-end relative">
                    <div
                        className={clsx(
                            'absolute',
                            'w-1 h-full rounded-full opacity-30',
                            `bg-${variant}`,
                        )}
                    />
                    <div
                        className={clsx(
                            'w-1 h-full rounded-full snackbar-timer',
                            `bg-${variant}`,
                        )}
                    />
                </div>
            </SnackbarContent>
        );
    },
);

export default memo(ThemeResponsiveSnackbar);
