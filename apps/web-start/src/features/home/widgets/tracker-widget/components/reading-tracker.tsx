import { useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type ReadArgs,
    type ReadContentTypeEnum,
    ReadStatusEnum,
    readAddMutation,
    readGetQueryKey,
    userReadListInfiniteOptions,
} from '@hikka/api';

import { ReadEditModal } from '@/components/action-buttons';
import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
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
import Spinner from '@/components/ui/spinner';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSession } from '@/features/auth/hooks/use-session';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import useDebounce from '@/services/hooks/use-debounce';
import { invalidateReadState } from '@/utils/api/invalidate-content-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { MANGA_MEDIA_TYPE, NOVEL_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useRouter } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

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

type ReadingTrackerProps = {
    contentType: typeof ContentTypeEnum.MANGA | typeof ContentTypeEnum.NOVEL;
};

const ReadingTracker = ({ contentType }: ReadingTrackerProps) => {
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { preferences } = useSessionUI();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const [selectedSlug, setSelectedSlug] = useState<string>();
    const [updatedRead, setUpdatedRead] = useState<ReadArgs | null>(null);

    // The generated read endpoints type `content_type` as `ReadContentTypeEnum`;
    // the `ContentTypeEnum.MANGA | NOVEL` values are identical strings.
    const apiContentType = contentType as unknown as ReadContentTypeEnum;

    const {
        list: apiList,
        ref,
        isFetchingNextPage,
    } = useInfiniteList(
        userReadListInfiniteOptions({
            path: {
                content_type: apiContentType,
                username: String(loggedUser?.username),
            },
            body: {
                read_status: ReadStatusEnum.READING,
                sort: ['read_updated:desc'],
            },
        }),
        { enabled: Boolean(loggedUser?.username) },
    );

    const list = apiList;

    const selectedRead =
        list?.find((item) => item.content.slug === selectedSlug) || list?.[0];

    const debouncedUpdatedRead = useDebounce({
        value: updatedRead,
        delay: 500,
    });

    const invalidateReadLists = (refetch: boolean) =>
        invalidateReadState(queryClient, { refetch });

    const { mutate: mutateCreateRead, reset } = useMutation({
        ...readAddMutation(),
        onSuccess: (data, { path }) => {
            queryClient.setQueryData(
                readGetQueryKey({
                    path: { content_type: path.content_type, slug: path.slug },
                }),
                data,
            );
            invalidateReadLists(true);
        },
    });

    const { mutate: mutateCreateReadSilent } = useMutation({
        ...readAddMutation(),
        onSuccess: (data, { path }) => {
            queryClient.setQueryData(
                readGetQueryKey({
                    path: { content_type: path.content_type, slug: path.slug },
                }),
                data,
            );
            invalidateReadLists(false);
        },
    });

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
        } as ReadArgs);
    };

    const handleRemoveChapter = () => {
        if (!selectedRead) return;

        const chapters = (updatedRead?.chapters ?? selectedRead.chapters) - 1;

        if (chapters < 0) return;

        setUpdatedRead({ ...selectedRead, chapters } as ReadArgs);
    };

    useEffect(() => {
        reset();
    }, [selectedSlug, reset]);

    useEffect(() => {
        setUpdatedRead(null);
    }, [selectedRead]);

    useEffect(() => {
        if (debouncedUpdatedRead && selectedRead) {
            const totalChapters = selectedRead.content.chapters;
            const isLastChapter =
                totalChapters != null &&
                debouncedUpdatedRead.chapters === totalChapters;

            const args = {
                note: debouncedUpdatedRead.note,
                volumes: debouncedUpdatedRead.volumes,
                rereads: debouncedUpdatedRead.rereads,
                score: debouncedUpdatedRead.score,
                status: debouncedUpdatedRead.status,
                chapters: debouncedUpdatedRead.chapters,
            };

            if (isLastChapter) {
                mutateCreateReadSilent({
                    path: {
                        content_type: apiContentType,
                        slug: selectedRead.content.slug,
                    },
                    body: args,
                });
            } else {
                mutateCreateRead({
                    path: {
                        content_type: apiContentType,
                        slug: selectedRead.content.slug,
                    },
                    body: args,
                });
            }
        }
    }, [
        mutateCreateRead,
        mutateCreateReadSilent,
        debouncedUpdatedRead,
        contentType,
    ]);

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
                <Stack
                    visibleScrollbar
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
                                {getTitle(
                                    item.content,
                                    preferences.title_language,
                                    preferences.name_language,
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    <div ref={ref} className="flex items-center justify-center">
                        {isFetchingNextPage && <Spinner />}
                    </div>
                </Stack>

                {selectedRead && (
                    <>
                        <Link
                            className="w-fit flex-1"
                            to={`${config.route}/${selectedRead.content.slug}`}
                        >
                            <h5>
                                {getTitle(
                                    selectedRead.content,
                                    preferences.title_language,
                                    preferences.name_language,
                                )}
                            </h5>
                            <div className="mt-1 flex cursor-pointer items-center gap-2">
                                {selectedRead.content.year && (
                                    <Label className="cursor-pointer text-muted-foreground text-xs">
                                        {selectedRead.content.year}
                                    </Label>
                                )}
                                {selectedRead.content.media_type && (
                                    <>
                                        <div className="size-1 rounded-full bg-muted-foreground" />
                                        <Label className="cursor-pointer text-muted-foreground text-xs">
                                            {
                                                (
                                                    config.mediaTypeMap as Record<
                                                        string,
                                                        { title_ua: string }
                                                    >
                                                )[
                                                    selectedRead.content
                                                        .media_type
                                                ]?.title_ua
                                            }
                                        </Label>
                                    </>
                                )}
                                {totalChapters && (
                                    <>
                                        <div className="size-1 rounded-full bg-muted-foreground" />
                                        <Label className="cursor-pointer text-muted-foreground text-xs">
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
                                <span className="font-bold text-foreground">
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
                <ResponsiveModal
                    open={open}
                    onOpenChange={setOpen}
                    forceDesktop
                >
                    <ResponsiveModalContent className="md:max-w-xl">
                        <ResponsiveModalHeader>
                            <ResponsiveModalTitle>
                                {getTitle(
                                    selectedRead.content,
                                    preferences.title_language,
                                    preferences.name_language,
                                )}
                            </ResponsiveModalTitle>
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
