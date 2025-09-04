'use client';

import { useNovelBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';

import Card from '@/components/ui/card';

import { cn } from '@/utils/utils';

import Chapters from './components/details/chapters';
import Magazines from './components/details/magazines';
import MediaType from './components/details/media-type';
import Status from './components/details/status';
import Volumes from './components/details/volumes';

const Details = ({ className }: { className?: string }) => {
    const params = useParams();

    const { data } = useNovelBySlug({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    return (
        <Card className={cn('bg-secondary/20 backdrop-blur', className)}>
            <MediaType media_type={data.media_type} />
            <Status status={data.status} />
            <Volumes volumes={data.volumes} />
            <Chapters chapters={data.chapters} />
            <Magazines magazines={data.magazines} />
        </Card>
    );
};

export default Details;
