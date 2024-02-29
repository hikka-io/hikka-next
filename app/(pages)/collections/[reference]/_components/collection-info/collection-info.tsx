'use client';

import React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useCollection } from '@/app/(pages)/collections/page.hooks';
import { useLoggedUser } from '@/app/page.hooks';
import SubHeader from '@/components/sub-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useCollectionContext } from '@/services/providers/collection-provider';


const Component = () => {
    const params = useParams();
    const { secret } = useAuthContext();
    const {
        description,
        nsfw,
        spoiler,
        private: isPrivate,
        setState: setCollectionState,
    } = useCollectionContext();

    const { data: loggedUser } = useLoggedUser();

    const { data: collection } = useCollection({
        reference: String(params.reference),
        secret,
    });

    return (
        <div className="flex flex-col items-start gap-8 w-full">
            <SubHeader title="Деталі" />
            <div className="flex p-4 flex-col gap-6 bg-secondary/30 border border-secondary/60 rounded-md w-full">
                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">Автор</Label>
                    <div className="flex w-full gap-4">
                        <Link href={`/u/${collection?.author.username}`}>
                            <Avatar className="rounded-md w-12 h-12">
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
                                <h5>{collection?.author.username}</h5>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Label htmlFor="nsfw" className="text-muted-foreground">
                        Контент +18
                    </Label>
                    <Switch checked={nsfw} id="nsfw" />
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Label htmlFor="spoiler" className="text-muted-foreground">
                        Спойлери
                    </Label>
                    <Switch checked={spoiler} id="spoiler" />
                </div>
                {collection?.author.username === loggedUser?.username && (
                    <div className="flex flex-col gap-4">
                        <Button asChild variant="secondary">
                            <Link
                                href={`/collections/${collection?.reference}/update`}
                            >
                                Редагувати
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Component;
