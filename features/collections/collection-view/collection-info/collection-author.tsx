'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import H5 from '@/components/typography/h5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

import useCollection from '@/services/hooks/collections/useCollection';

const CollectionAuthor = () => {
    const params = useParams();

    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    return (
        <div className="flex flex-col gap-4">
            <Label className="text-muted-foreground">Автор</Label>
            <div className="flex w-full gap-4">
                <Link href={`/u/${collection?.author.username}`}>
                    <Avatar className="size-12 rounded-md">
                        <AvatarImage
                            className="rounded-md"
                            src={collection?.author.avatar}
                            alt={collection?.author.username}
                        />
                        <AvatarFallback className="rounded-md">
                            {collection?.author.username[0]}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-1 flex-col">
                    <Link href={'/u/' + collection?.author.username}>
                        <H5>{collection?.author.username}</H5>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CollectionAuthor;
