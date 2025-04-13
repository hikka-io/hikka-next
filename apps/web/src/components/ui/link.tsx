import NextLink, { LinkProps } from 'next/link';
import { ComponentPropsWithRef, FC } from 'react';

import { cn } from '@/utils/utils';

interface Props extends Omit<LinkProps, 'href'>, ComponentPropsWithRef<'a'> {
    href?: string;
    className?: string;
    children?: React.ReactNode;
}

const Link: FC<Props> = ({ href, className, children, ...props }) => {
    if (href) {
        return (
            <NextLink
                href={href}
                className={cn(
                    'cursor-pointer transition-all hover:underline',
                    className,
                )}
                {...props}
            >
                {children}
            </NextLink>
        );
    }

    return <div className={className}>{children}</div>;
};

export default Link;
