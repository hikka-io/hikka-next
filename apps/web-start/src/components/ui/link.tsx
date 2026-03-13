import { Link as TanstackLink } from '@/utils/navigation';
import { ComponentPropsWithRef, FC } from 'react';

import { cn } from '@/utils/cn';

interface Props extends Omit<ComponentPropsWithRef<'a'>, 'href'> {
    href?: string;
    to?: string;
    search?: Record<string, unknown>;
    className?: string;
    children?: React.ReactNode;
}

const Link: FC<Props> = ({ href, to, search, className, children, ...props }) => {
    const url = to ?? href;
    if (url) {
        return (
            <TanstackLink
                to={url}
                search={search}
                className={cn(
                    'cursor-pointer transition-all hover:underline',
                    className,
                )}
                {...props}
            >
                {children}
            </TanstackLink>
        );
    }

    return <div className={className}>{children}</div>;
};

export default Link;
