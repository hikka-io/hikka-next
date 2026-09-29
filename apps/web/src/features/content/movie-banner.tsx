import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { MessageCirclePlus, Popcorn } from 'lucide-react';

import { animeSlugOptions } from '@hikka/api';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSession } from '@/services/session';
import { Link, useParams } from '@/utils/navigation';
import { type PlausibleEvents, usePlausible } from '@/utils/plausible';

import { MOVIE_BANNERS } from './movie-banners';

type Props = {};

const ContentMovieBanner: FC<Props> = () => {
    const { user } = useSession();
    const plausible = usePlausible<PlausibleEvents>();
    const params = useParams();
    const { data: anime } = useQuery(
        animeSlugOptions({ path: { slug: String(params.slug) } }),
    );
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const banner = MOVIE_BANNERS.find(
        (mb) =>
            mb.slug === params.slug &&
            mb.duration[0] <= currentTimestamp &&
            mb.duration[1] >= currentTimestamp,
    );

    if (!anime || !banner) return null;

    const handleTrackEvent = () => {
        plausible('movie-banner-click');
    };

    return (
        <Card
            variant="plain"
            className="isolate flex-col justify-between overflow-hidden bg-center md:flex-row"
            style={{ backgroundImage: `url(${banner.image ?? anime?.image})` }}
        >
            <div className="gradient-mask-t-40 absolute top-0 left-0 -z-10 size-full backdrop-blur" />
            <div className="absolute top-0 left-0 -z-50 size-full bg-black/40" />
            <div className="flex items-center gap-4">
                <Popcorn className="size-6" />
                <div className="flex flex-col justify-center gap-1">
                    <h3 className="leading-5">{banner.title}</h3>
                    <Label>{banner.description}</Label>
                </div>
            </div>
            <Button
                className="border-primary-foreground bg-primary/60"
                onClick={handleTrackEvent}
                render={<Link to="#comments" />}
            >
                <MessageCirclePlus />
                Написати коментар
            </Button>
        </Card>
    );
};

export default ContentMovieBanner;
