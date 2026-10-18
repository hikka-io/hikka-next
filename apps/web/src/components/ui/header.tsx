import {
    type AnchorHTMLAttributes,
    type FC,
    type PropsWithChildren,
    type Ref,
    useId,
} from 'react';

import { MaterialSymbolsChevronRightRounded } from '@/components/icons/material-symbols/MaterialSymbolsChevronRightRounded';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

const TITLE_SIZES = {
    page: 'text-2xl leading-8 font-bold',
    section: 'text-lg leading-7 font-bold',
    subsection: 'text-base leading-6 font-semibold',
} as const;

type HeaderProps = {
    className?: string;
    id?: string;
};

const Header: FC<PropsWithChildren<HeaderProps>> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn('flex min-h-8 items-center gap-3', className)}
            {...props}
        >
            {children}
        </div>
    );
};

type HeaderTitleProps = {
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
    size?: keyof typeof TITLE_SIZES;
    to?: string;
    href?: string;
    search?: Record<string, unknown>;
    linkProps?: Partial<AnchorHTMLAttributes<HTMLAnchorElement>>;
    onClick?: () => void;
    truncate?: boolean;
    count?: number;
    countPending?: boolean;
    ref?: Ref<HTMLDivElement>;
};

type HeaderCountProps = {
    count?: number;
    pending?: boolean;
};

const COUNT_CLASS_NAME =
    'relative ml-0.5 shrink-0 font-medium text-muted-foreground tabular-nums';

const HeaderCount: FC<HeaderCountProps> = ({ count, pending }) => {
    if (count !== undefined) {
        return <span className={COUNT_CLASS_NAME}>{count}</span>;
    }

    if (pending) {
        return (
            <span aria-hidden className={COUNT_CLASS_NAME}>
                <span className="invisible">00</span>
                <Skeleton className="absolute inset-x-0 top-1/2 h-[1em] -translate-y-1/2" />
            </span>
        );
    }

    return null;
};

const HeaderTitle: FC<PropsWithChildren<HeaderTitleProps>> = ({
    className,
    children,
    as: Tag = 'h2',
    size = 'section',
    to,
    href,
    search,
    linkProps,
    onClick,
    truncate,
    count,
    countPending,
    ref,
}) => {
    const titleId = useId();
    const url = to ?? href;
    const hasCount = count !== undefined || !!countPending;
    const countSlot = <HeaderCount count={count} pending={countPending} />;
    const sizeClass = TITLE_SIZES[size];
    const triggerClass = cn(
        'group/header-title -mx-1.5 -my-1.5 inline-flex min-h-10 min-w-0 items-center gap-1 rounded-md px-1.5 py-1.5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        sizeClass,
    );

    const content = (
        <>
            <span
                id={titleId}
                className={cn(
                    'underline-offset-4 group-hover/header-title:underline',
                    truncate && 'truncate',
                )}
            >
                {children}
            </span>
            {countSlot}
            <MaterialSymbolsChevronRightRounded
                aria-hidden
                className="shrink-0 text-muted-foreground transition-transform group-hover/header-title:translate-x-0.5 group-hover/header-title:text-foreground"
            />
        </>
    );

    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center',
                truncate && 'min-w-0',
                className,
            )}
        >
            {url || onClick ? (
                <Tag
                    aria-labelledby={hasCount ? titleId : undefined}
                    className={cn('flex min-w-0', sizeClass)}
                >
                    {url ? (
                        <Link
                            to={url}
                            search={search}
                            {...linkProps}
                            className={triggerClass}
                        >
                            {content}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={onClick}
                            className={triggerClass}
                        >
                            {content}
                        </button>
                    )}
                </Tag>
            ) : (
                <>
                    <Tag className={cn(sizeClass, truncate && 'truncate')}>
                        {children}
                    </Tag>
                    {hasCount && (
                        <span className={cn('ml-1.5 flex', sizeClass)}>
                            {countSlot}
                        </span>
                    )}
                </>
            )}
        </div>
    );
};

type HeaderActionsProps = {
    className?: string;
};

const HeaderActions: FC<PropsWithChildren<HeaderActionsProps>> = ({
    className,
    children,
}) => {
    return (
        <div
            className={cn(
                'ml-auto flex shrink-0 items-center gap-2',
                className,
            )}
        >
            {children}
        </div>
    );
};

export { Header, HeaderActions, HeaderTitle };
