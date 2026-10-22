import type { FC, ReactNode } from 'react';

import { getLinkDisplayUrl } from '@hikka/core';

type Props = {
    icon: ReactNode;
    label: string;
    url: string;
};

const LinkSummary: FC<Props> = ({ icon, label, url }) => (
    <>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/40 [&_img]:size-6 [&_img]:object-contain [&_svg]:size-5">
            {icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
            <span className="line-clamp-2 whitespace-normal break-words font-medium text-sm">
                {label}
            </span>
            <span className="truncate font-normal text-muted-foreground text-xs">
                {getLinkDisplayUrl(url)}
            </span>
        </span>
    </>
);

export default LinkSummary;
