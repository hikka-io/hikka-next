'use client';

import { ContentTypeEnum, ReadArgs, ReadStatusEnum } from '@hikka/client';
import { useCreateRead, useSearchUserReads, useSession } from '@hikka/react';
import { useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';

import { ReadEditModal } from '@/features/read';

import useDebounce from '@/services/hooks/use-debounce';
import { cn } from '@/utils/cn';
import { MANGA_MEDIA_TYPE, NOVEL_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useRouter } from '@/utils/navigation';

const CHAPTERS_DECLENSION: [string, string, string] = [
    'розділ',
    'розділи',
    'розділів',
];

const CONTENT_TYPE_CONFIG = {
    [ContentTypeEnum.MANGA]: {
        route: '/manga',
        mediaTypeMap: MANGA_MEDIA_TYPE,
        emptyDescription: 'Додайте манґу у список Читаю',
    },
    [ContentTypeEnum.NOVEL]: {
        route: '/novel',
        mediaTypeMap: NOVEL_MEDIA_TYPE,
        emptyDescription: 'Додайте ранобе у список Читаю',
    },
} as const;

interface ReadingTrackerProps {
    contentType: ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL;
}

const ReadingTracker = ({ contentType }: ReadingTrackerProps) => {
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const [open, setOpen] = useState(false);

    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [updatedRead, setUpdatedRead] = useState<ReadArgs | null>(null);

    const { list } = useSearchUserReads({
        contentType,
        username: String(loggedUser?.username),
        args: {
            read_status: ReadStatusEnum.READING,
            sort: ['read_updated:desc'],
        },
    });

    const selectedRead =
        list?.find((item) => item.content.slug === selectedSlug) || list?.[0];

    const debouncedUpdatedRead = useDebounce({
        value: updatedRead,
        delay: 500,
    });

    const { mutate: mutateCreateRead, reset } = useCreateRead();

    const config = CONTENT_TYPE_CONFIG[contentType];

    const handleSelect = (slug: string) => {
        if (slug === selectedRead?.content.slug) {
            router.push(`${config.route}/${slug}`);
            return;
        }

        setSelectedSlug(slug);
        setUpdatedRead(null);
    };

    const openReadEditModal = () => {
        if (!selectedRead) return;
        setOpen(true);
    };

    const handleAddChapter = () => {
        if (!selectedRead) return;

        const chapters = (updatedRead?.chapters ?? selectedRead.chapters) + 1;

        if (
            selectedRead.content.chapters &&
            chapters > selectedRead.content.chapters
        )
            return;

        setUpdatedRead({
            ...selectedRead,
            status:
                chapters === selectedRead.content.chapters
                    ? ReadStatusEnum.COMPLETED
                    : ReadStatusEnum.READING,
            chapters,
        });
    };

    const handleRemoveChapter = () => {
        if (!selectedRead) return;

        const chapters = (updatedRead?.chapters ?? selectedRead.chapters) - 1;

        if (chapters < 0) return;

        setUpdatedRead({ ...selectedRead, chapters });
    };

    useEffect(() => {
        reset();
    }, [selectedSlug, reset]);

    useEffect(() => {
        setUpdatedRead(null);
    }, [selectedRead]);

    useEffect(() => {
        if (debouncedUpdatedRead && selectedRead) {
            mutateCreateRead({
                contentType,
                slug: selectedRead.content.slug,
                args: {
                    note: debouncedUpdatedRead.note,
                    volumes: debouncedUpdatedRead.volumes,
                    rereads: debouncedUpdatedRead.rereads,
                    score: debouncedUpdatedRead.score,
                    status: debouncedUpdatedRead.status,
                    chapters: debouncedUpdatedRead.chapters,
                },
            });
        }
    }, [mutateCreateRead, debouncedUpdatedRead]);

    if (!list || list.length === 0) {
        return (
            <NotFound
                title={
                    <span>
                        Список <span className="font-extrabold">Читаю</span>{' '}
                        порожній
                    </span>
                }
                description={config.emptyDescription}
            />
        );
    }

    const currentChapters =
        updatedRead?.chapters ?? selectedRead?.chapters ?? 0;
    const totalChapters = selectedRead?.content.chapters;

    return (
        <>
        <div className="flex flex-col gap-4">
            <Stack className="grid-min-3 grid-max-3 grid gap-4 lg:gap-4" imagePreset="cardXs">
                {list.map((item) => (
                    <Tooltip key={item.content.slug}>
                        <TooltipTrigger asChild>
                            <ContentCard
                                onClick={() => handleSelect(item.content.slug)}
                                image={item.content.image}
                                containerClassName="rounded-(--base-radius)"
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

            {selectedRead && (
                <>
                    <Link
                        className="w-fit flex-1"
                        to={`${config.route}/${selectedRead.content.slug}`}
                    >
                        <h5>{selectedRead.content.title}</h5>
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
                                            (
                                                config.mediaTypeMap as Record<
                                                    string,
                                                    { title_ua: string }
                                                >
                                            )[selectedRead.content.media_type]
                                                ?.title_ua
                                        }
                                    </Label>
                                </>
                            )}
                            {totalChapters && (
                                <>
                                    <div className="bg-muted-foreground size-1 rounded-full" />
                                    <Label className="text-muted-foreground cursor-pointer text-xs">
                                        {totalChapters}{' '}
                                        {getDeclensionWord(
                                            totalChapters,
                                            CHAPTERS_DECLENSION,
                                        )}
                                    </Label>
                                </>
                            )}
                        </div>
                    </Link>

                    <div className="flex w-full flex-col gap-2">
                        <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-bold">
                                {currentChapters}
                            </span>
                            /{totalChapters ?? '?'} розділів
                        </p>
                        <Progress
                            className="h-2"
                            value={currentChapters}
                            max={totalChapters ?? currentChapters}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon-md"
                            className="shrink-0"
                            onClick={openReadEditModal}
                        >
                            <MaterialSymbolsSettingsOutlineRounded />
                        </Button>
                        <div className="flex flex-1">
                            <Button
                                className="flex-1 rounded-r-none"
                                onClick={handleAddChapter}
                                variant="secondary"
                                size="md"
                            >
                                <MaterialSymbolsAddRounded />
                                <div className="flex gap-1">
                                    <span className="hidden sm:block">
                                        Додати
                                    </span>
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
                </>
            )}
        </div>
        {selectedRead && (
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent className="max-w-xl!">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{selectedRead.content.title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    <ReadEditModal
                        read={selectedRead}
                        slug={selectedRead.content.slug}
                        content_type={contentType}
                        onClose={() => setOpen(false)}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        )}
        </>
    );
};

export default ReadingTracker;
