import clsx from 'clsx';
import { ForwardedRef, forwardRef, MouseEventHandler, ReactNode, Ref } from 'react';
import { UrlObject } from 'url';

import Link from 'next/link';

import Image from '@/app/_components/Image';

interface Props {
    target?: string;
    title?: string;
    desc?: string;
    poster?: string | ReactNode;
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
                        'relative w-full overflow-hidden rounded-lg bg-gray-400 pt-[140%]',
                        containerClassName,
                    )}
                >
                    <div className='absolute left-0 top-0 h-full w-full flex place-items-center bg-secondary/60'>
                        {poster && (
                            typeof poster === 'string' ?
                                <figure className='relative h-full w-full flex place-items-center'>
                                    <Image
                                        src={poster}
                                        width={184}
                                        height={259}
                                        className={clsx(
                                            'h-full w-full object-cover',
                                            posterClassName,
                                        )}
                                        alt='Poster'
                                    />
                                </figure> : poster
                        )}
                    </div>
                    {children}
                </div>
                {(title || desc) && (
                    <div className='mt-1'>
                        {desc && <p className='label-text-alt mb-1'>{desc}</p>}
                        {title && (
                            <p className='label-text !text-base-content'>
                                {title}
                            </p>
                        )}
                    </div>
                )}
            </>
        );

        if (!href) {
            return (
                <div
                    ref={ref as Ref<HTMLDivElement>}
                    className='group flex w-full flex-col gap-2'
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
                className='group flex w-full flex-col gap-2'
                scroll
                {...props}
            >
                {content}
            </Link>
        );
    },
);

export default Component;
