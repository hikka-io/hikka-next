'use client';

import { Link } from '@tanstack/react-router';
import React, { FC, PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';

import { MaterialSymbolsArrowRightAltRounded } from '../icons/material-symbols/MaterialSymbolsArrowRightAltRounded';
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
    href?: string;
}

const HeaderTitle: FC<PropsWithChildren<HeaderTitleProps>> = ({
    className,
    children,
    variant,
    href: hrefProp,
}) => {
    const { href, onClick, linkProps } = useHeader();
    const Tag = variant || 'h3';

    const heading = <Tag>{children}</Tag>;

    return (
        <div className={cn('flex items-center gap-4', className)}>
            {hrefProp || href ? (
                <Link
                    to={hrefProp || href || ''}
                    {...linkProps}
                    className="hover:underline text-left"
                >
                    {heading}
                </Link>
            ) : onClick ? (
                <button onClick={onClick} className="hover:underline text-left">
                    {heading}
                </button>
            ) : (
                heading
            )}
        </div>
    );
};

interface HeaderDescriptionProps {
    className?: string;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    href?: string;
}

const HeaderDescription: FC<PropsWithChildren<HeaderDescriptionProps>> = ({
    className,
    children,
}) => {
    return (
        <span className={cn('text-sm text-muted-foreground', className)}>
            {children}
        </span>
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
                    to={href}
                    className="flex items-center gap-2 text-muted-foreground"
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
            className="flex items-center gap-2 text-muted-foreground"
            variant="ghost"
        >
            <MaterialSymbolsArrowRightAltRounded className="text-lg" />
        </Button>
    );
};

export {
    Header,
    HeaderContainer,
    HeaderDescription,
    HeaderNavButton,
    HeaderTitle,
};
