import { Link as TanstackLink } from '@tanstack/react-router';
import { ComponentPropsWithRef, FC } from 'react';

import { cn } from '@/utils/cn';

interface Props extends Omit<ComponentPropsWithRef<'a'>, 'href'> {
    href?: string;
    className?: string;
    children?: React.ReactNode;
}

const Link: FC<Props> = ({ href, className, children, ...props }) => {
    if (href) {
        return (
            <TanstackLink
                to={href as any}
                className={cn(
                    'cursor-pointer transition-all hover:underline',
                    className,
                )}
                {...(props as any)}
            >
                {children}
            </TanstackLink>
        );
    }

    return <div className={className}>{children}</div>;
};

export default Link;
