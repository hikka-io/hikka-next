'use client';

import { ContentTypeEnum, MangaMediaEnum, ReadStatusEnum } from '@hikka/client';
import {
    useCreateRead,
    useHikkaClient,
    useSearchUserReads,
    useSession,
} from '@hikka/react';
import { getTitle } from '@hikka/react/utils';
import React, { useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import { MaterialSymbolsSettingsOutlineRounded } from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { ReadEditModal } from '@/features/read';

import { cn } from '@/utils/cn';
import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useRouter } from '@/utils/navigation';

const CHAPTERS_DECLENSION: [string, string, string] = [
    'розділ',
    'розділи',
    'розділів',
];

interface MangaReadlistProps {}

const MangaReadlist: React.FC<MangaReadlistProps> = () => {
    // Hooks and Context
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { defaultOptions } = useHikkaClient();
    const [open, setOpen] = useState(false);

    // State Management
    const [selectedSlug, setSelectedSlug] = useState<string>();

    // Fetch Readlist
    const { list } = useSearchUserReads({
        contentType: ContentTypeEnum.MANGA,
        username: String(loggedUser?.username),
        args: {
            read_status: ReadStatusEnum.READING,
            sort: ['read_updated:desc'],
        },
    });

    // Derived State
    const selectedRead =
        list?.find((item) => item.content.slug === selectedSlug) || list?.[0];

    // Hooks
    const {
        mutate: mutateCreateRead,
        variables,
        isPending,
        reset,
    } = useCreateRead();

    // Event Handlers
    const handleSelect = (slug: string) => {
        if (slug === selectedRead?.content.slug) {
            router.push(`/manga/${slug}`);
            return;
        }

        setSelectedSlug(slug);
    };

    const openReadEditModal = () => {
        if (selectedRead) {
            setOpen(true);
        }
    };

    const handleAddChapter = () => {
        if (!selectedRead) return;

        const chapters =
            (variables?.args?.chapters || selectedRead.chapters) + 1;

        // Prevent exceeding total chapters
        if (
            selectedRead.content.chapters &&
            chapters > selectedRead.content.chapters
        )
            return;

        mutateCreateRead({
            contentType: ContentTypeEnum.MANGA,
            slug: selectedRead.content.slug,
            args: {
                note: selectedRead.note,
                volumes: selectedRead.volumes,
                rereads: selectedRead.rereads,
                score: selectedRead.score,
                status:
                    chapters === selectedRead.content.chapters
                        ? ReadStatusEnum.COMPLETED
                        : ReadStatusEnum.READING,
                chapters,
            },
        });
    };

    const handleRemoveChapter = () => {
        if (!selectedRead) return;

        const chapters =
            (variables?.args?.chapters || selectedRead.chapters) - 1;

        if (chapters < 0) return;

        mutateCreateRead({
            contentType: ContentTypeEnum.MANGA,
            slug: selectedRead.content.slug,
            args: {
                note: selectedRead.note,
                volumes: selectedRead.volumes,
                rereads: selectedRead.rereads,
                score: selectedRead.score,
                status: selectedRead.status,
                chapters,
            },
        });
    };

    // Side Effects
    useEffect(() => {
        reset();
    }, [selectedSlug]);

    // Rendering Helper: Manga Details
    const renderMangaDetails = () => {
        if (!selectedRead) return null;

        return (
            <div className="mt-1 flex cursor-pointer items-center gap-2">
                {selectedRead.content.year && (
                    <Label className="text-muted-foreground cursor-pointer text-xs">
                        {selectedRead.content.year}
                    </Label>
                )}
                {selectedRead.content.media_type && (
                    <>
                        <div className="bg-muted-foreground size-1 rounded-full" />
                        <Label className="text-muted-foreground cursor-pointer text-xs">
                            {
                                MANGA_MEDIA_TYPE[
                                    selectedRead.content
                                        .media_type as MangaMediaEnum
                                ].title_ua
                            }
                        </Label>
                    </>
                )}
                {selectedRead.content.chapters && (
                    <>
                        <div className="bg-muted-foreground size-1 rounded-full" />
                        <Label className="text-muted-foreground cursor-pointer text-xs">
                            {selectedRead.content.chapters}{' '}
                            {getDeclensionWord(
                                selectedRead.content.chapters,
                                CHAPTERS_DECLENSION,
                            )}
                        </Label>
                    </>
                )}
            </div>
        );
    };

    // Rendering Helper: Action Buttons
    const renderActionButtons = () => (
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="md" onClick={openReadEditModal}>
                <MaterialSymbolsSettingsOutlineRounded />
                Налаштування
            </Button>
            <div className="flex">
                <Button
                    className="flex-1 rounded-r-none"
                    onClick={handleAddChapter}
                    variant="secondary"
                    size="md"
                >
                    <MaterialSymbolsAddRounded />
                    <div className="flex gap-1">
                        <span className="hidden sm:block">Додати</span>
                        <span className="capitalize sm:normal-case">
                            розділ
                        </span>
                    </div>
                </Button>
                <Button
                    className="rounded-l-none"
                    onClick={handleRemoveChapter}
                    variant="secondary"
                    size="icon-md"
                >
                    <MaterialSymbolsRemoveRounded />
                </Button>
            </div>
        </div>
    );

    // Main Render
    return (
        <>
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
            )}
            {list && list.length > 0 && (
                <div className="flex h-full flex-col gap-4">
                    <Stack
                        className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4"
                        imagePreset="cardXs"
                    >
                        {list.map((item) => (
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
                                    {getTitle(item.content, defaultOptions?.title, defaultOptions?.name)}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </Stack>

                    {selectedRead && (
                        <>
                            <Link
                                className="w-fit flex-1"
                                to={`/manga/${selectedRead.content.slug}`}
                            >
                                <h5>{getTitle(selectedRead.content, defaultOptions?.title, defaultOptions?.name)}</h5>
                                {renderMangaDetails()}
                            </Link>

                            <div className="flex w-full flex-col gap-2">
                                <p className="text-muted-foreground text-sm">
                                    <span className="text-foreground font-bold">
                                        {isPending
                                            ? variables?.args?.chapters
                                            : selectedRead.chapters || 0}
                                    </span>
                                    /{selectedRead.content.chapters || '?'}{' '}
                                    розділів
                                </p>

                                <Progress
                                    className="h-2"
                                    value={
                                        isPending
                                            ? variables?.args?.chapters
                                            : selectedRead.chapters
                                    }
                                    max={
                                        selectedRead.content.chapters ||
                                        selectedRead.chapters
                                    }
                                />
                            </div>

                            {renderActionButtons()}
                        </>
                    )}
                </div>
            )}
            {selectedRead && (
                <ResponsiveModal
                    open={open}
                    onOpenChange={setOpen}
                    forceDesktop
                >
                    <ResponsiveModalContent className="md:max-w-xl">
                        <ResponsiveModalHeader>
                            <ResponsiveModalTitle>
                                {getTitle(selectedRead.content, defaultOptions?.title, defaultOptions?.name)}
                            </ResponsiveModalTitle>
                        </ResponsiveModalHeader>
                        <ReadEditModal
                            read={selectedRead}
                            slug={selectedRead.content.slug}
                            content_type={ContentTypeEnum.MANGA}
                            onClose={() => setOpen(false)}
                        />
                    </ResponsiveModalContent>
                </ResponsiveModal>
            )}
        </>
    );
};

export default MangaReadlist;
