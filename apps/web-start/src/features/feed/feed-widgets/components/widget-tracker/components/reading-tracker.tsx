'use client';

import { ContentTypeEnum, ReadArgs, ReadStatusEnum } from '@hikka/client';
import {
    useCreateRead,
    useSearchUserReads,
    useSession,
} from '@hikka/react';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';

import { ReadEditModal } from '@/features/read';

import useDebounce from '@/services/hooks/use-debounce';
import { useModalContext } from '@/services/providers/modal-provider';
import { MANGA_MEDIA_TYPE, NOVEL_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';

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
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

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

    const handleSelectChange = (value: string[]) => {
        const slug = value[0];
        if (slug) {
            setSelectedSlug(slug);
            setUpdatedRead(null);
        }
    };

    const openReadEditModal = () => {
        if (!selectedRead) return;

        openModal({
            content: (
                <ReadEditModal
                    read={selectedRead}
                    slug={selectedRead.content.slug}
                    content_type={contentType}
                />
            ),
            className: '!max-w-xl',
            title: selectedRead.content.title,
            forceModal: true,
        });
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
        <div className="flex flex-col gap-4">
            {selectedRead && (
                <Link
                    to={`${config.route}/${selectedRead.content.slug}`}
                    className="relative block overflow-hidden rounded-lg"
                >
                    <ContentCard
                        image={selectedRead.content.image}
                        className="aspect-video w-full"
                        containerClassName="rounded-lg"
                        containerRatio={16 / 9}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                        <p className="line-clamp-1 text-sm font-bold text-white">
                            {selectedRead.content.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
                            {selectedRead.content.year && (
                                <span>{selectedRead.content.year}</span>
                            )}
                            {selectedRead.content.media_type && (
                                <>
                                    <div className="size-1 rounded-full bg-white/70" />
                                    <span>
                                        {
                                            (config.mediaTypeMap as Record<string, { title_ua: string }>)[
                                                selectedRead.content.media_type
                                            ]?.title_ua
                                        }
                                    </span>
                                </>
                            )}
                            {totalChapters && (
                                <>
                                    <div className="size-1 rounded-full bg-white/70" />
                                    <span>
                                        {totalChapters}{' '}
                                        {getDeclensionWord(
                                            totalChapters,
                                            CHAPTERS_DECLENSION,
                                        )}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
            )}

            <Select
                value={selectedRead ? [selectedRead.content.slug] : undefined}
                onValueChange={handleSelectChange}
            >
                <SelectTrigger size="md">
                    <span className="min-w-0 flex-1 truncate text-left">
                        {selectedRead?.content.title}
                    </span>
                    <SelectIcon />
                </SelectTrigger>
                <SelectContent className="w-56">
                    <SelectList>
                        <SelectGroup>
                            {list.map((item) => (
                                <SelectItem
                                    key={item.content.slug}
                                    value={item.content.slug}
                                >
                                    {item.content.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>

            {selectedRead && (
                <>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">
                                {currentChapters}
                            </span>
                            /{totalChapters ?? '?'}{' '}
                            {getDeclensionWord(
                                totalChapters ?? 0,
                                CHAPTERS_DECLENSION,
                            )}
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
                                Додати розділ
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
    );
};

export default ReadingTracker;
