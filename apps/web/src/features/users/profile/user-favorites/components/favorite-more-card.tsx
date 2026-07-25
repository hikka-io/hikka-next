import type { FC } from 'react';

import type { FavouriteContentTypeEnum } from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import Image from '@/components/ui/image';

type Props = {
    count: number;
    image?: string | null;
    username: string;
    type: FavouriteContentTypeEnum;
};

/**
 * Trailing card of a preview stack: a blurred copy of the next poster behind a
 * `+N` label linking to the full list.
 */
const FavoriteMoreCard: FC<Props> = ({ count, image, username, type }) => {
    return (
        <ContentCard
            to={`/u/${username}/favorites`}
            linkProps={{ search: { type } }}
            image={
                <div className="isolate flex items-center justify-center">
                    {image && (
                        <Image
                            className="absolute inset-0 size-full blur-lg"
                            src={image}
                            alt=""
                        />
                    )}
                    <span className="relative font-bold text-2xl text-white drop-shadow-lg">
                        +{count}
                    </span>
                </div>
            }
        />
    );
};

export default FavoriteMoreCard;
