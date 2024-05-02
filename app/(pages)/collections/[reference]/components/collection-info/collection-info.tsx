'use client';

import React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import FavoriteButton from '@/components/favorite-button';
import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useSession from '@/services/hooks/auth/useSession';
import useCollection from '@/services/hooks/collections/useCollection';
import { useCollectionContext } from '@/services/providers/collection-provider';

import CollectionAuthor from './components/collection-author';
import CollectionDeleteModal from './components/collection-delete-modal';
import CollectionVote from './components/collection-vote';

const CollectionInfo = () => {
    const params = useParams();
    const { nsfw, spoiler, tags } = useCollectionContext();

    const { user: loggedUser } = useSession();

    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    const access =
        collection?.author.username === loggedUser?.username ||
        loggedUser?.role === 'admin' ||
        loggedUser?.role === 'moderator';

    if (!collection) {
        return null;
    }

    return (
        <Block>
            <Header title="Деталі" />
            <div className="flex w-full flex-col gap-4">
                <Card className="w-full gap-6">
                    <CollectionAuthor />
                    {tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag.toLowerCase()}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="nsfw" className="text-muted-foreground">
                            Контент +18
                        </Label>
                        <Switch checked={nsfw} id="nsfw" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <Label
                            htmlFor="spoiler"
                            className="text-muted-foreground"
                        >
                            Спойлери
                        </Label>
                        <Switch checked={spoiler} id="spoiler" />
                    </div>

                    {access && (
                        <div className="flex gap-2">
                            <Button
                                asChild
                                className="flex-1"
                                variant="secondary"
                            >
                                <Link
                                    href={`/collections/${collection?.reference}/update`}
                                >
                                    Редагувати
                                </Link>
                            </Button>
                            <CollectionDeleteModal />
                        </div>
                    )}
                </Card>

                <div className="flex w-full items-center gap-2">
                    <CollectionVote />
                    <FavoriteButton
                        disabled={!loggedUser}
                        slug={collection.reference}
                        content_type="collection"
                        size="icon"
                        variant="secondary"
                    />
                </div>
            </div>
        </Block>
    );
};

export default CollectionInfo;
