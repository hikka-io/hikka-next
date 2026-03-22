import { FC, ReactNode } from 'react';

import ContentCard from './content-card';

interface Props {
    href: string;
    image: string | ReactNode;
}

const CardOverlay: FC<Props> = ({ href, image }) => (
    <>
        <div className="from-background absolute bottom-0 left-0 z-0 h-16 w-full bg-linear-to-t to-transparent" />
        <div className="absolute right-2 bottom-2 z-1 flex h-auto shadow-xl ">
            <ContentCard
                className="w-12 transition-all hover:w-20"
                containerClassName="rounded-(--base-radius)"
                href={href}
                image={image}
            />
        </div>
    </>
);

export default CardOverlay;
