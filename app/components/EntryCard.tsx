import Image from '@/app/components/Image';
import Link, { LinkProps } from 'next/link';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props extends LinkProps {
    target?: string;
    title: string;
    desc?: string;
    poster?: string;
    posterClassName?: string;
    containerClassName?: string;
    children?: ReactNode;
}

const Component = ({
    poster,
    title,
    desc,
    posterClassName,
    containerClassName,
    children,
    ...props
}: Props) => {
    return (
        <Link className="flex flex-col gap-2" scroll {...props}>
            <div
                className={clsx(
                    'w-full pt-[140%] relative bg-gray-400 overflow-hidden rounded-lg',
                    containerClassName,
                )}
            >
                <div className="absolute w-full h-full bg-inherit top-0 left-0">
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
                    {children}
                </div>
            </div>
            <div className="mt-1">
                {desc && <p className="text-secondary text-sm mb-1">{desc}</p>}
                <p className="text-white">{title}</p>
            </div>
        </Link>
    );
};

export default Component;
