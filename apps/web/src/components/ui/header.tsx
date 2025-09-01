'use client';

import Link from 'next/link';
import React, { FC, PropsWithChildren, useCallback } from 'react';

import { cn } from '@/utils/utils';

import { MaterialSymbolsArrowRightAltRounded } from '../icons/material-symbols/MaterialSymbolsArrowRightAltRounded';
import H1 from '../typography/h1';
import H2 from '../typography/h2';
import H3 from '../typography/h3';
import H4 from '../typography/h4';
import H5 from '../typography/h5';
import { Button } from './button';

interface HorizontalCardContextProps {
    href?: string;
    onClick?: () => void;
    linkProps?: Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
}

const HeaderContext = React.createContext<
    HorizontalCardContextProps | undefined
>(undefined);

const useHeader = () => {
    const context = React.useContext(HeaderContext);

    if (!context) {
        throw new Error('useHeader must be used within HeaderContext');
    }

    return context;
};

interface HeaderProps {
    className?: string;
    href?: string;
    linkProps?: Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    onClick?: () => void;
    id?: string;
}

const Header: FC<PropsWithChildren<HeaderProps>> = ({
    className,
    children,
    href,
    onClick,
    linkProps,
    ...props
}) => {
    const contextValue = React.useMemo(() => {
        return {
            href,
            onClick,
            linkProps,
        };
    }, [href, onClick, linkProps]);

    return (
        <HeaderContext.Provider value={contextValue}>
            <div
                className={cn(
                    'flex items-center justify-between gap-2',
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </HeaderContext.Provider>
    );
};

interface HeaderContainerProps {
    className?: string;
}

const HeaderContainer: FC<PropsWithChildren<HeaderContainerProps>> = ({
    className,
    children,
}) => {
    return (
        <div className={cn('flex flex-1 items-center gap-4', className)}>
            {children}
        </div>
    );
};

interface HeaderTitleProps {
    className?: string;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

const HeaderTitle: FC<PropsWithChildren<HeaderTitleProps>> = ({
    className,
    children,
    variant,
}) => {
    const { href, onClick, linkProps } = useHeader();
    const getTitle = useCallback(() => {
        switch (variant) {
            case 'h1':
                return H1;
            case 'h2':
                return H2;
            case 'h3':
                return H3;
            case 'h4':
                return H4;
            case 'h5':
                return H5;
            default:
                return H3;
        }
    }, [variant]);

    const Title = getTitle();

    return (
        <div className={cn('flex items-center gap-4', className)}>
            {href ? (
                <Link href={href} {...linkProps} className="hover:underline">
                    <Title>{children}</Title>
                </Link>
            ) : onClick ? (
                <button onClick={onClick} className="hover:underline">
                    <Title>{children}</Title>
                </button>
            ) : (
                <Title>{children}</Title>
            )}
        </div>
    );
};

const HeaderNavButton: FC = () => {
    const { href, onClick, linkProps } = useHeader();

    if (!href && !onClick) {
        return null;
    }

    if (href) {
        return (
            <Button size="icon-sm" variant="ghost" asChild>
                <Link
                    href={href}
                    className="text-muted-foreground flex items-center gap-2"
                    {...linkProps}
                >
                    <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                </Link>
            </Button>
        );
    }

    return (
        <Button
            onClick={onClick}
            size="icon-sm"
            className="text-muted-foreground flex items-center gap-2"
            variant="ghost"
        >
            <MaterialSymbolsArrowRightAltRounded className="text-lg" />
        </Button>
    );
};

export { Header, HeaderContainer, HeaderNavButton, HeaderTitle };
