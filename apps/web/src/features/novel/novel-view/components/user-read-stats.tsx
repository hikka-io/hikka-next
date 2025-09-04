'use client';

import { ContentTypeEnum, ReadStatusEnum } from '@hikka/client';
import { useCreateRead, useNovelBySlug, useReadBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

import { useSettingsStore } from '@/services/stores/settings-store';

const ReadStats = () => {
    const params = useParams();

    const { collapsibles, setCollapsibles } = useSettingsStore();

    const { data: read, isError: readError } = useReadBySlug({
        slug: String(params.slug),
        contentType: ContentTypeEnum.NOVEL,
    });
    const { data } = useNovelBySlug({ slug: String(params.slug) });

    const { mutate: mutateCreateRead, variables, isPending } = useCreateRead();

    const handleAddEpisode = () => {
        if (read) {
            const chapters = (variables?.args?.chapters || read.chapters) + 1;

            if (read.content.chapters && chapters > read.content.chapters)
                return;

            let status = read.status;

            if (chapters === read.content.chapters) {
                status = ReadStatusEnum.COMPLETED;
            }

            if (!read.chapters && read.status === ReadStatusEnum.PLANNED) {
                status = ReadStatusEnum.READING;
            }

            mutateCreateRead({
                contentType: ContentTypeEnum.NOVEL,
                slug: read.content.slug,
                args: {
                    note: read.note,
                    volumes: read.volumes,
                    rereads: read.rereads,
                    score: read.score,
                    status,
                    chapters,
                },
            });
        }
    };

    const handleRemoveEpisode = () => {
        if (read) {
            const chapters = (variables?.args?.chapters || read.chapters) - 1;

            if (chapters < 0) return;

            mutateCreateRead({
                contentType: ContentTypeEnum.NOVEL,
                slug: read.content.slug,
                args: {
                    note: read.note,
                    volumes: read.volumes,
                    rereads: read.rereads,
                    score: read.score,
                    status: read.status,
                    chapters,
                },
            });
        }
    };

    const handleRating = (value: number) => {
        if (read) {
            mutateCreateRead({
                contentType: ContentTypeEnum.NOVEL,
                slug: read.content.slug,
                args: {
                    note: read.note,
                    volumes: read.volumes,
                    chapters: read.chapters,
                    rereads: read.rereads,
                    status: read.status,
                    score: value * 2,
                },
            });
        }
    };

    if (!read || readError || !data) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <CollapsibleFilter
                title="Оцінка"
                open={collapsibles.content_score}
                onOpenChange={(open) =>
                    setCollapsibles({
                        ...collapsibles,
                        content_score: open,
                    })
                }
                defaultOpen
            >
                <div className="flex items-center justify-between gap-4">
                    <Rating
                        onChange={handleRating}
                        totalStars={5}
                        precision={0.5}
                        value={read.score ? read.score / 2 : 0}
                    />
                    <P className="text-muted-foreground text-sm">
                        <span className="text-foreground font-bold">
                            {read.score}
                        </span>
                        /10
                    </P>
                </div>
            </CollapsibleFilter>
            <CollapsibleFilter
                title="Розділи"
                open={collapsibles.content_progress}
                onOpenChange={(open) =>
                    setCollapsibles({
                        ...collapsibles,
                        content_progress: open,
                    })
                }
                defaultOpen
            >
                <div className="flex w-full flex-col gap-2">
                    <P className="text-muted-foreground text-sm">
                        <span className="text-foreground font-bold">
                            {isPending
                                ? variables?.args?.chapters
                                : read.chapters}
                        </span>
                        /{read.content.chapters || '?'} розділів
                    </P>
                    <Progress
                        className="h-2"
                        max={read.content.chapters || read.chapters}
                        value={
                            isPending
                                ? variables?.args?.chapters
                                : read.chapters
                        }
                    />
                </div>
                <div className="flex">
                    <Button
                        className="flex-1 rounded-r-none"
                        onClick={handleAddEpisode}
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
                        onClick={handleRemoveEpisode}
                        variant="secondary"
                        size="icon-md"
                    >
                        <MaterialSymbolsRemoveRounded />
                    </Button>
                </div>
            </CollapsibleFilter>
        </div>
    );
};

export default ReadStats;
