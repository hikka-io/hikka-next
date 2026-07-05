import { useEffect, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type ReadArgs,
    type ReadContentTypeEnum,
    ReadStatusEnum,
    readAddMutation,
    userReadListInfiniteOptions,
} from '@hikka/api';

import { ReadEditModal } from '@/components/action-buttons';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { useSession } from '@/features/auth/hooks/use-session';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import useDebounce from '@/services/hooks/use-debounce';
import {
    invalidateReadState,
    writeReadToCaches,
} from '@/utils/api/invalidate-content-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { MANGA_MEDIA_TYPE, NOVEL_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useRouter } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

import ProgressTrackerView from './progress-tracker-view';

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

    const { list, ref, isFetchingNextPage } = useInfiniteList(
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
        onSuccess: (data) => {
            writeReadToCaches(queryClient, data);
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

            mutateCreateRead(
                {
                    path: {
                        content_type: apiContentType,
                        slug: selectedRead.content.slug,
                    },
                    body: args,
                },
                // Skip the immediate list refetch on the final chapter so the
                // entry doesn't reorder/vanish mid-interaction.
                { onSuccess: () => invalidateReadLists(!isLastChapter) },
            );
        }
    }, [mutateCreateRead, debouncedUpdatedRead, contentType]);

    if (!list || list.length === 0) {
        return (
            <EmptyState
                icon={<MaterialSymbolsMenuBookRounded />}
                title={
                    <span>
                        Список <span className="font-extrabold">Читаю</span>{' '}
                        порожній
                    </span>
                }
                description={config.emptyDescription}
                action={
                    <Button variant="secondary" size="md" asChild>
                        <Link to="/manga">Знайти манґу</Link>
                    </Button>
                }
            />
        );
    }

    const currentChapters =
        updatedRead?.chapters ?? selectedRead?.chapters ?? 0;
    const totalChapters = selectedRead?.content.chapters;

    return (
        <ProgressTrackerView
            items={list.map((item) => ({
                slug: item.content.slug,
                image: item.content.image,
                title: getTitle(
                    item.content,
                    preferences.title_language,
                    preferences.name_language,
                ),
                isSelected: selectedRead?.content.slug === item.content.slug,
                onSelect: () => handleSelect(item.content.slug),
            }))}
            listRef={ref}
            isFetchingNextPage={isFetchingNextPage}
            selected={
                selectedRead
                    ? {
                          href: `${config.route}/${selectedRead.content.slug}`,
                          title: getTitle(
                              selectedRead.content,
                              preferences.title_language,
                              preferences.name_language,
                          ),
                          year: selectedRead.content.year,
                          mediaTypeLabel: selectedRead.content.media_type
                              ? (
                                    config.mediaTypeMap as Record<
                                        string,
                                        { title_ua: string }
                                    >
                                )[selectedRead.content.media_type]?.title_ua
                              : undefined,
                          total: totalChapters ?? undefined,
                          totalDeclension: totalChapters
                              ? getDeclensionWord(
                                    totalChapters,
                                    CHAPTERS_DECLENSION,
                                )
                              : undefined,
                          current: currentChapters,
                          progressUnit: 'розділів',
                          addUnitLabel: 'розділ',
                          onAdd: handleAddChapter,
                          onRemove: handleRemoveChapter,
                          onOpenEdit: openReadEditModal,
                      }
                    : undefined
            }
            editModal={
                selectedRead
                    ? {
                          open,
                          onOpenChange: setOpen,
                          title: getTitle(
                              selectedRead.content,
                              preferences.title_language,
                              preferences.name_language,
                          ),
                          children: (
                              <ReadEditModal
                                  read={selectedRead}
                                  slug={selectedRead.content.slug}
                                  content_type={contentType}
                                  onClose={() => setOpen(false)}
                              />
                          ),
                      }
                    : undefined
            }
        />
    );
};

export default ReadingTracker;
