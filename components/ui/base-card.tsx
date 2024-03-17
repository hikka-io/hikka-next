import {
    ForwardedRef,
    MouseEventHandler,
    ReactNode,
    forwardRef,
    memo,
} from 'react';
import { UrlObject } from 'url';
import MaterialSymbolsImageNotSupportedOutlineRounded from '~icons/material-symbols/image-not-supported-outline-rounded';

import Link from 'next/link';

import P from '@/components/typography/p';
import Image from '@/components/ui/image';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';

export interface Props {
    target?: string;
    title?: string;
    description?: string;
    leftSubtitle?: string;
    rightSubtitle?: string;
    poster?: string | ReactNode;
    href?: string | UrlObject;
    posterClassName?: string;
    containerClassName?: string;
    titleClassName?: string;
    className?: string;
    disableChildrenLink?: boolean;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement> &
        MouseEventHandler<HTMLDivElement>;
}

const Component = forwardRef(
    (
        {
            poster,
            title,
            description,
            leftSubtitle,
            rightSubtitle,
            posterClassName,
            containerClassName,
            titleClassName,
            className,
            children,
            href,
            disableChildrenLink,
            onClick,
            ...props
        }: Props,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const Comp = href ? Link : 'div';

        return (
            <div
                ref={ref}
                className={cn(
                    'group relative flex w-full flex-col gap-2',
                    onClick && 'cursor-pointer',
                    className,
                )}
                onClick={onClick}
                {...props}
            >
                <div
                    className={cn(
                        'relative w-full overflow-hidden rounded-md bg-muted pt-[140%]',
                        containerClassName,
                    )}
                >
                    <Comp
                        href={href || ''}
                        className="absolute left-0 top-0 flex size-full items-center justify-center bg-secondary/60"
                    >
                        {poster ? (
                            typeof poster === 'string' ? (
                                <figure className="relative flex size-full place-items-center">
                                    <Image
                                        src={poster}
                                        width={184}
                                        height={259}
                                        className={cn(
                                            'size-full object-cover',
                                            posterClassName,
                                        )}
                                        alt="Poster"
                                    />
                                </figure>
                            ) : (
                                poster
                            )
                        ) : (
                            <MaterialSymbolsImageNotSupportedOutlineRounded className="text-4xl text-muted-foreground" />
                        )}
                        {!disableChildrenLink && children}
                    </Comp>
                    {disableChildrenLink && children}
                </div>
                {(title || description) && (
                    <Comp
                        href={href || ''}
                        className={cn(
                            'mt-1',
                            (leftSubtitle || rightSubtitle) && 'truncate',
                        )}
                    >
                        {description && (
                            <P className="mb-1 truncate text-xs text-muted-foreground">
                                {description}
                            </P>
                        )}
                        {title && (
                            <Label
                                className={cn(
                                    'cursor-pointer leading-5',
                                    !leftSubtitle &&
                                        !rightSubtitle &&
                                        'line-clamp-2',
                                    titleClassName,
                                )}
                            >
                                {title}
                            </Label>
                        )}
                        {(leftSubtitle || rightSubtitle) && (
                            <div className="mt-1 flex cursor-pointer items-center gap-2">
                                {leftSubtitle && (
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {leftSubtitle}
                                    </Label>
                                )}
                                {leftSubtitle && rightSubtitle && (
                                    <div className="size-1 rounded-full bg-muted-foreground" />
                                )}
                                {rightSubtitle && (
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {rightSubtitle}
                                    </Label>
                                )}
                            </div>
                        )}
                    </Comp>
                )}
            </div>
        );
    },
);

export default memo(Component);
