'use client';

import { useAnimeBySlug, useSession } from '@hikka/react';
import { MessageCirclePlus, Popcorn } from 'lucide-react';
import { usePlausible } from 'next-plausible';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { MOVIE_BANNERS } from '@/utils/constants/banners';

interface Props {}

const MovieBanner: FC<Props> = () => {
    const { user } = useSession();
    const plausible = usePlausible<Hikka.PlausibleEvents>();
    const params = useParams();
    const { data: anime } = useAnimeBySlug({ slug: String(params.slug) });
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
            className="isolate flex-col justify-between overflow-hidden bg-center md:flex-row"
            style={{ backgroundImage: `url(${banner.image ?? anime?.image})` }}
        >
            <div className="gradient-mask-t-40 absolute left-0 top-0 -z-10 size-full backdrop-blur" />
            <div className="absolute left-0 top-0 -z-50 size-full bg-black/40" />
            <div className="flex items-center gap-4">
                <Popcorn className="size-6" />
                <div className="flex flex-col justify-center gap-1">
                    <H3 className="leading-5">{banner.title}</H3>
                    <Label>{banner.description}</Label>
                </div>
            </div>
            <Button
                className="border-primary-foreground bg-primary/60"
                onClick={handleTrackEvent}
                asChild
            >
                <Link href="#comments">
                    <MessageCirclePlus />
                    Написати коментар
                </Link>
            </Button>
        </Card>
    );
};

export default MovieBanner;
