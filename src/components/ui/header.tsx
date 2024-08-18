import clsx from 'clsx';
import Link from 'next/link';
import { PropsWithChildren, ReactNode, memo } from 'react';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';

import H1 from '@/components/typography/h1';
import H2 from '@/components/typography/h2';
import H3 from '@/components/typography/h3';
import H4 from '@/components/typography/h4';
import H5 from '@/components/typography/h5';
import { Button } from '@/components/ui/button';

interface Props extends PropsWithChildren {
    title: string | ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    className?: string;
    titleClassName?: string;
    linkProps?: Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
}

const Header = ({
    title,
    href,
    linkProps,
    onClick,
    variant,
    children,
    className,
    titleClassName,
}: Props) => {
    const getTitle = () => {
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
    };

    const Title = getTitle();

    return (
        <div
            className={clsx(
                'flex items-center justify-between gap-2',
                className,
            )}
        >
            <div
                className={clsx(
                    'flex items-center gap-4 overflow-hidden',
                    titleClassName,
                )}
            >
                {href ? (
                    <Link
                        href={href}
                        {...linkProps}
                        className="hover:underline"
                    >
                        <Title>{title}</Title>
                    </Link>
                ) : onClick ? (
                    <button onClick={onClick} className="hover:underline">
                        <Title>{title}</Title>
                    </button>
                ) : (
                    <Title>{title}</Title>
                )}
                <div className="no-scrollbar inline-flex gap-4 overflow-x-scroll">
                    {children}
                </div>
            </div>
            {href && (
                <Button size="icon-sm" variant="outline" asChild>
                    <Link href={href} {...linkProps}>
                        <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                    </Link>
                </Button>
            )}
            {onClick && (
                <Button size="icon-sm" variant="outline" onClick={onClick}>
                    <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                </Button>
            )}
        </div>
    );
};

export default memo(Header);
