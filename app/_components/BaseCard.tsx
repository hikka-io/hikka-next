import Image from '@/app/_components/Image';
import Link from 'next/link';
import clsx from 'clsx';
import {
    ForwardedRef,
    forwardRef,
    MouseEventHandler,
    ReactNode,
    Ref,
} from 'react';
import { UrlObject } from 'url';

interface Props {
    target?: string;
    title?: string;
    desc?: string;
    poster?: string;
    href?: string | UrlObject;
    posterClassName?: string;
    containerClassName?: string;
    onMouseOver?: MouseEventHandler<HTMLAnchorElement>;
    onMouseOut?: MouseEventHandler<HTMLAnchorElement>;
    children?: ReactNode;
}

const Component = forwardRef(
    (
        {
            poster,
            title,
            desc,
            posterClassName,
            containerClassName,
            children,
            onMouseOver,
            onMouseOut,
            href,
            ...props
        }: Props,
        ref: ForwardedRef<HTMLAnchorElement>,
    ) => {
        const content = (
            <>
                <div
                    className={clsx(
                        'w-full pt-[140%] relative bg-gray-400 overflow-hidden rounded-lg',
                        containerClassName,
                    )}
                >
                    <div className="absolute w-full h-full bg-secondary/60 top-0 left-0">
                        {poster && (
                            <figure className="w-full h-full relative">
                                <Image
                                    src={poster}
                                    width={184}
                                    height={259}
                                    className={clsx(
                                        'w-full h-full object-cover',
                                        posterClassName,
                                    )}
                                    alt="Poster"
                                />
                            </figure>
                        )}
                    </div>
                    {children}
                </div>
                {(title || desc) && (
                    <div className="mt-1">
                        {desc && (
                            <p className="label-text text-sm mb-1">{desc}</p>
                        )}
                        {title && <p className="text-white">{title}</p>}
                    </div>
                )}
            </>
        );

        if (!href) {
            return (
                <div
                    ref={ref as Ref<HTMLDivElement>}
                    className="flex flex-col gap-2 group w-full"
                >
                    {content}
                </div>
            );
        }

        return (
            <Link
                ref={ref}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                href={href}
                className="flex flex-col gap-2 group w-full"
                scroll
                {...props}
            >
                {content}
            </Link>
        );
    },
);

export default Component;
