'use client';

import React from 'react';
import MaterialSymbolsDeleteForeverRounded from '~icons/material-symbols/delete-forever-rounded';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import FavoriteButton from '@/components/favorite-button';
import SubHeader from '@/components/sub-header';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useCollection from '@/services/hooks/collections/useCollection';
import useDeleteCollection from '@/services/hooks/collections/useDeleteCollection';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import { useCollectionContext } from '@/services/providers/collection-provider';

const Component = () => {
    const params = useParams();
    const { nsfw, spoiler, tags } = useCollectionContext();

    const { data: loggedUser } = useLoggedUser();

    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    const { mutate: mutateDeleteCollection } = useDeleteCollection({
        reference: String(params.reference),
    });

    const access =
        collection?.author.username === loggedUser?.username ||
        loggedUser?.role === 'admin' ||
        loggedUser?.role === 'moderator';

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
                                <H5>{collection?.author.username}</H5>
                            </Link>
                        </div>
                    </div>
                </div>
                {tags.length > 0 && (
                    <div className="flex items-center gap-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag.toLowerCase()}
                            </Badge>
                        ))}
                    </div>
                )}
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
                <div className="flex flex-col gap-4">
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
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="icon" variant="destructive">
                                        <MaterialSymbolsDeleteForeverRounded className="text-lg" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Ви впевнені, що хочете видалити
                                            колекцію?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <P>
                                                Колекція{' '}
                                                <span className="font-bold">
                                                    {collection?.title}
                                                </span>{' '}
                                                буде видалена назавжди.
                                            </P>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Відмінити
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                mutateDeleteCollection()
                                            }
                                        >
                                            Підтвердити
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    {collection && (
                        <FavoriteButton
                            slug={collection.reference}
                            content_type="collection"
                            size="default"
                            variant="secondary"
                            className=""
                        >
                            Улюблене
                        </FavoriteButton>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Component;
