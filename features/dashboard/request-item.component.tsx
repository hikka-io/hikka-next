import Link from 'next/link';
import { FC } from 'react';
import MaterialSymbolsPersonOutlineRounded from '~icons/material-symbols/person-outline-rounded';

import Image from '@/components/ui/image';

interface Props {
    title: string;
    href: string;
    poster: string;
    type: string;
    requests: number;
}

const RequestItem: FC<Props> = ({ title, href, poster, type, requests }) => {
    return (
        <Link
            className="flex justify-between transition hover:scale-[1.02]"
            href={href}
        >
            <div className="flex max-w-60 items-center gap-3">
                <Image
                    src={poster}
                    width={60}
                    height={225}
                    className="size-full h-[60px] w-[41px] rounded-md object-cover"
                    alt="Poster"
                />
                <div className="flex w-full flex-col">
                    <h5 className="line-clamp-2 font-display text-sm font-medium leading-5">
                        <Link href={``}>{title}</Link>
                    </h5>
                    <h5 className="text-xs font-medium leading-4 text-muted-foreground">
                        {type}
                    </h5>
                </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
                <h5 className="font-display text-sm font-medium">{requests}</h5>
                <MaterialSymbolsPersonOutlineRounded />
            </div>
        </Link>
    );
};

export default RequestItem;
