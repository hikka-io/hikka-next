'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import {
    ContentTypeEnum,
    type MangaMediaEnum,
    type NovelMediaEnum,
    ReadStatusEnum,
} from '@hikka/client';
import {
    useCreateRead,
    useHikkaClient,
    useSearchUserReads,
    useSession,
} from '@hikka/react';
import { getTitle } from '@hikka/react/utils';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import { ReadEditModal } from '@/features/read';
import { MANGA_MEDIA_TYPE, NOVEL_MEDIA_TYPE } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { useRouter } from '@/utils/navigation';

import ProgressTrackerView, {
    ProgressTrackerMeta,
} from './progress-tracker-view';

const CHAPTERS_DECLENSION: [string, string, string] = [
    'розділ',
    'розділи',
    'розділів',
];

type ReadContentType = ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL;

const READLIST_CONFIG: Record<
    ReadContentType,
    {
        route: string;
        mediaTypeMap: Record<string, { title_ua: string }>;
        emptyNoun: string;
    }
> = {
    [ContentTypeEnum.MANGA]: {
        route: '/manga',
        mediaTypeMap: MANGA_MEDIA_TYPE as Record<
            MangaMediaEnum,
            { title_ua: string }
        >,
        emptyNoun: 'манґу',
    },
    [ContentTypeEnum.NOVEL]: {
        route: '/novel',
        mediaTypeMap: NOVEL_MEDIA_TYPE as Record<
            NovelMediaEnum,
            { title_ua: string }
        >,
        emptyNoun: 'ранобе',
    },
};

type Props = {
    contentType: ReadContentType;
};

const ReadlistWidget: React.FC<Props> = ({ contentType }) => {
    const config = READLIST_CONFIG[contentType];
    const router = useRouter();
    const { user: loggedUser } = useSession();
    const { defaultOptions } = useHikkaClient();
    const [open, setOpen] = useState(false);
    const [selectedSlug, setSelectedSlug] = useState<string>();

    const { list, isLoading } = useSearchUserReads({
        contentType,
        username: String(loggedUser?.username),
        args: {
            read_status: ReadStatusEnum.READING,
            sort: ['read_updated:desc'],
        },
    });

    const selectedRead =
        list?.find((item) => item.content.slug === selectedSlug) || list?.[0];

    const {
        mutate: mutateCreateRead,
        variables,
        isPending,
        reset,
    } = useCreateRead();

    const handleSelect = (slug: string) => {
        if (slug === selectedRead?.content.slug) {
            router.push(`${config.route}/${slug}`);
            return;
        }

        setSelectedSlug(slug);
    };

    const handleAddChapter = () => {
        if (!selectedRead) return;

        const chapters =
            (variables?.args?.chapters ?? selectedRead.chapters) + 1;

        if (
            selectedRead.content.chapters &&
            chapters > selectedRead.content.chapters
        )
            return;

        mutateCreateRead({
            contentType,
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
            (variables?.args?.chapters ?? selectedRead.chapters) - 1;

        if (chapters < 0) return;

        mutateCreateRead({
            contentType,
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

    useEffect(() => {
        reset();
    }, [selectedSlug]);

    const selectedTitle = selectedRead
        ? getTitle(
              selectedRead.content,
              defaultOptions?.title,
              defaultOptions?.name,
          )
        : '';

    return (
        <ProgressTrackerView
            isLoading={isLoading}
            isEmpty={list?.length === 0}
            emptyTitle={
                <span>
                    Список <span className="font-extrabold">Читаю</span>{' '}
                    порожній
                </span>
            }
            emptyDescription={`Додайте ${config.emptyNoun} у список Читаю, щоб відстежувати їх прогрес`}
            items={(list ?? []).map((item) => ({
                slug: item.content.slug,
                image: item.content.image,
                title: getTitle(
                    item.content,
                    defaultOptions?.title,
                    defaultOptions?.name,
                ),
            }))}
            selected={
                selectedRead && {
                    slug: selectedRead.content.slug,
                    href: `${config.route}/${selectedRead.content.slug}`,
                    title: selectedTitle,
                    details: (
                        <ProgressTrackerMeta
                            year={selectedRead.content.year}
                            mediaTypeLabel={
                                selectedRead.content.media_type
                                    ? config.mediaTypeMap[
                                          selectedRead.content.media_type
                                      ]?.title_ua
                                    : undefined
                            }
                            total={selectedRead.content.chapters}
                            totalWord={
                                selectedRead.content.chapters
                                    ? getDeclensionWord(
                                          selectedRead.content.chapters,
                                          CHAPTERS_DECLENSION,
                                      )
                                    : undefined
                            }
                        />
                    ),
                    current:
                        (isPending
                            ? variables?.args?.chapters
                            : selectedRead.chapters) ?? 0,
                    total: selectedRead.content.chapters ?? undefined,
                    unitLabel: 'розділів',
                    actionUnit: 'розділ',
                }
            }
            onSelect={handleSelect}
            onAdd={handleAddChapter}
            onRemove={handleRemoveChapter}
            onOpenSettings={() => selectedRead && setOpen(true)}
            modal={
                selectedRead && (
                    <ResponsiveModal
                        open={open}
                        onOpenChange={setOpen}
                        forceDesktop
                    >
                        <ResponsiveModalContent className="md:max-w-xl">
                            <ResponsiveModalHeader>
                                <ResponsiveModalTitle>
                                    {selectedTitle}
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
                )
            }
        />
    );
};

export default ReadlistWidget;
