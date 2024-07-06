import Link from 'next/link';
import { FC } from 'react';
import MaterialSymbolsArrowForwardIosRounded from '~icons/material-symbols/arrow-forward-ios-rounded';

interface Props {
    title: string;
    href: string;
    text?: number;
    icon?: React.ReactNode;
}

const CardItem: FC<Props> = ({ title, href, text, icon }) => {
    return (
        <Link
            className="flex justify-between transition hover:scale-[1.02]"
            href={href}
        >
            <div className="flex items-center gap-2">
                {icon && (
                    <div className="flex size-6 items-center justify-center rounded-sm bg-secondary/60 p-1">
                        {icon}
                    </div>
                )}
                <h5 className="font-display text-sm font-medium text-muted-foreground">
                    {title}
                </h5>
            </div>
            <div className="flex items-center gap-2">
                <h5 className="font-display text-sm font-medium">{text}</h5>
                <MaterialSymbolsArrowForwardIosRounded className="size-2 text-muted-foreground" />
            </div>
        </Link>
    );
};

export default CardItem;
