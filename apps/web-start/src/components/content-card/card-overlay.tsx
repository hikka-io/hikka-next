import { FC, ReactNode } from 'react';

import ContentCard from './content-card';

interface Props {
    href: string;
    image: string | ReactNode;
}

const CardOverlay: FC<Props> = ({ href, image }) => (
    <>
        <div className="from-background absolute bottom-0 left-0 z-0 h-16 w-full bg-linear-to-t to-transparent" />
        <div className="border-border absolute right-2 bottom-2 z-1 flex h-auto w-16 rounded-lg border shadow-lg transition-all hover:w-28">
            <ContentCard href={href} image={image} />
        </div>
    </>
);

export default CardOverlay;
