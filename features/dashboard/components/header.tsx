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
}

const Header = ({
    title,
    href,
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
                    <Link href={href} className="hover:underline">
                        <Title>{title}</Title>
                    </Link>
                ) : onClick ? (
                    <button onClick={onClick} className="hover:underline">
                        <Title>{title}</Title>
                    </button>
                ) : (
                    <Title>{title}</Title>
                )}
            </div>
            <div className="flex gap-2">
                {children}
                {href && (
                    <Button
                        size="icon-sm"
                        variant="outline"
                        className="backdrop-blur"
                        asChild
                    >
                        <Link href={href}>
                            <MaterialSymbolsArrowRightAltRounded className="text-lg" />
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default memo(Header);
