'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import { MaterialSymbolsSettingsOutlineRounded } from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import ReadEditModal from '@/features/modals/read-edit-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import useAddRead from '@/services/hooks/read/use-add-read';
import useReadList from '@/services/hooks/read/use-read-list';
import { useModalContext } from '@/services/providers/modal-provider';
import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';
import { cn } from '@/utils/utils';

const CHAPTERS_DECLENSION: [string, string, string] = [
    'розділ',
    'розділи',
    'розділів',
];

const Manga = () => {
    const router = useRouter();
    const { openModal } = useModalContext();
    const [selectedSlug, setSelectedSlug] = useState<string>();
    const { user: loggedUser } = useSession();

    const { list } = useReadList({
        username: String(loggedUser?.username),
        read_status: 'reading',
        sort: ['read_updated:desc'],
        content_type: 'manga',
    });

    const selectedRead =
        list?.find((item) => item.content.slug === selectedSlug) || list?.[0];

    const { mutate: mutateAddRead, variables, isPending, reset } = useAddRead();

    const handleSelect = (slug: string) => {
        if (slug === selectedSlug) {
            router.push(`/manga/${slug}`);
        }

        setSelectedSlug(slug);
    };

    const openReadEditModal = () => {
        if (selectedRead) {
            openModal({
                content: (
                    <ReadEditModal
                        read={selectedRead}
                        slug={selectedRead.content.slug}
                        content_type={'manga'}
                    />
                ),
                className: '!max-w-xl',
                title: selectedRead.content.title,
                forceModal: true,
            });
        }
    };

    const handleAddChapter = () => {
        if (selectedRead) {
            const chapters =
                (variables?.params?.chapters || selectedRead.chapters) + 1;

            if (
                selectedRead.content.chapters &&
                chapters > selectedRead.content.chapters
            )
                return;

            mutateAddRead({
                params: {
                    note: selectedRead.note,
                    volumes: selectedRead.volumes,
                    rereads: selectedRead.rereads,
                    score: selectedRead.score,
                    content_type: 'manga',
                    status:
                        chapters === selectedRead.content.chapters
                            ? 'completed'
                            : 'reading',
                    slug: selectedRead.content.slug,
                    chapters,
                },
            });
        }
    };

    const handleRemoveChapter = () => {
        if (selectedRead) {
            const chapters =
                (variables?.params?.chapters || selectedRead.chapters) - 1;

            if (chapters < 0) return;

            mutateAddRead({
                params: {
                    note: selectedRead.note,
                    volumes: selectedRead.volumes,
                    rereads: selectedRead.rereads,
                    score: selectedRead.score,
                    status: selectedRead.status,
                    content_type: 'manga',
                    slug: selectedRead.content.slug,
                    chapters,
                },
            });
        }
    };

    useEffect(() => {
        reset();
    }, [selectedSlug]);

    return (
        <Fragment>
            {list?.length === 0 && (
                <NotFound
                    title={
                        <span>
                            Список <span className="font-extrabold">Читаю</span>{' '}
                            порожній
                        </span>
                    }
                    description="Додайте манґу у список Читаю, щоб відстежувати їх прогрес"
                />
            )}{' '}
            {list && list?.length > 0 && (
                <Card className="h-full">
                    <Stack className="grid-min-3 grid-max-3 gap-4 lg:gap-4">
                        {list?.map((item) => (
                            <Tooltip key={item.content.slug}>
                                <TooltipTrigger asChild>
                                    <ContentCard
                                        onClick={() =>
                                            handleSelect(item.content.slug)
                                        }
                                        image={item.content.image}
                                        className={cn(
                                            'transition-opacity',
                                            selectedRead?.content.slug !==
                                                item.content.slug &&
                                                'opacity-30 hover:opacity-60',
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-48 truncate">
                                    {item.content.title}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </Stack>
                    <Link
                        className="w-fit flex-1"
                        href={`/manga/${selectedRead?.content.slug}`}
                    >
                        <H5>{selectedRead?.content.title}</H5>
                        <div className="mt-1 flex cursor-pointer items-center gap-2">
                            {selectedRead?.content.year && (
                                <Fragment>
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {selectedRead?.content.year}
                                    </Label>
                                </Fragment>
                            )}
                            {selectedRead?.content.media_type && (
                                <Fragment>
                                    <div className="size-1 rounded-full bg-muted-foreground" />
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {
                                            MANGA_MEDIA_TYPE[
                                                selectedRead?.content
                                                    .media_type as API.MangaMediaType
                                            ].title_ua
                                        }
                                    </Label>
                                </Fragment>
                            )}
                            {selectedRead?.content.chapters && (
                                <Fragment>
                                    <div className="size-1 rounded-full bg-muted-foreground" />
                                    <Label className="cursor-pointer text-xs text-muted-foreground">
                                        {selectedRead?.content?.chapters}{' '}
                                        {getDeclensionWord(
                                            selectedRead?.content.chapters,
                                            CHAPTERS_DECLENSION,
                                        )}
                                    </Label>
                                </Fragment>
                            )}
                        </div>
                    </Link>
                    <div className="flex w-full flex-col gap-2">
                        <P className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">
                                {isPending
                                    ? variables?.params?.chapters
                                    : selectedRead?.chapters || 0}
                            </span>
                            /{selectedRead?.content.chapters || '?'} розділів
                        </P>

                        <Progress
                            className="h-2"
                            value={
                                isPending
                                    ? variables?.params?.chapters
                                    : selectedRead?.chapters
                            }
                            max={
                                selectedRead?.content.chapters ||
                                selectedRead?.chapters
                            }
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={openReadEditModal}
                        >
                            <MaterialSymbolsSettingsOutlineRounded />
                            Налаштування
                        </Button>
                        <div className="flex">
                            <Button
                                className="flex-1 rounded-r-none"
                                onClick={handleAddChapter}
                                variant="secondary"
                                size="md"
                                // disabled={isPending}
                            >
                                <MaterialSymbolsAddRounded />
                                <div className="flex gap-1">
                                    <span className="hidden sm:block">
                                        Додати
                                    </span>
                                    <span className="capitalize	sm:normal-case">
                                        розділ
                                    </span>
                                </div>
                            </Button>
                            <Button
                                className="rounded-l-none"
                                onClick={handleRemoveChapter}
                                variant="secondary"
                                size="icon-md"
                                // disabled={isPending}
                            >
                                <MaterialSymbolsRemoveRounded />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </Fragment>
    );
};

export default Manga;
