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
                    'relative group flex w-full flex-col gap-2',
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
                        className="absolute left-0 top-0 h-full w-full flex items-center justify-center bg-secondary/60"
                    >
                        {poster ? (
                            typeof poster === 'string' ? (
                                <figure className="relative h-full w-full flex place-items-center">
                                    <Image
                                        src={poster}
                                        width={184}
                                        height={259}
                                        className={cn(
                                            'h-full w-full object-cover',
                                            posterClassName,
                                        )}
                                        alt="Poster"
                                    />
                                </figure>
                            ) : (
                                poster
                            )
                        ) : (
                            <MaterialSymbolsImageNotSupportedOutlineRounded className="text-muted-foreground text-4xl" />
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
                            <P className="text-xs text-muted-foreground mb-1 truncate">
                                {description}
                            </P>
                        )}
                        {title && (
                            <Label
                                className={cn(
                                    'leading-5 cursor-pointer',
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
                            <div className="flex gap-2 mt-1 items-center cursor-pointer">
                                {leftSubtitle && (
                                    <Label className="text-xs text-muted-foreground cursor-pointer">
                                        {leftSubtitle}
                                    </Label>
                                )}
                                {leftSubtitle && rightSubtitle && (
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                )}
                                {rightSubtitle && (
                                    <Label className="text-xs text-muted-foreground cursor-pointer">
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
