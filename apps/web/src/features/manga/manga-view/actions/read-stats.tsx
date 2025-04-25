'use client';

import { ContentTypeEnum, ReadStatusEnum } from '@hikka/client';
import { useAddOrUpdateRead, useMangaInfo, useReadEntry } from '@hikka/react';
import { useParams } from 'next/navigation';

import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

const ReadStats = () => {
    const params = useParams();

    const { data: read, isError: readError } = useReadEntry({
        slug: String(params.slug),
        contentType: ContentTypeEnum.MANGA,
    });
    const { data } = useMangaInfo({ slug: String(params.slug) });

    const {
        mutate: mutateAddOrUpdateRead,
        variables,
        isPending,
    } = useAddOrUpdateRead();

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

            mutateAddOrUpdateRead({
                contentType: ContentTypeEnum.MANGA,
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

            mutateAddOrUpdateRead({
                contentType: ContentTypeEnum.MANGA,
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
            mutateAddOrUpdateRead({
                contentType: ContentTypeEnum.MANGA,
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
        <div className="flex flex-col gap-4">
            <div className="border-border bg-secondary/20 flex justify-between gap-4 rounded-lg border p-4">
                <Rating
                    // className="rating-md lg:flex"
                    onChange={handleRating}
                    totalStars={5}
                    precision={0.5}
                    value={read.score ? read.score / 2 : 0}
                />
                <H3>
                    {read.score}
                    <Label className="text-muted-foreground text-sm font-normal">
                        /10
                    </Label>
                </H3>
            </div>
            <div className="border-border bg-secondary/20 rounded-lg border p-4">
                <div className="flex justify-between gap-2 overflow-hidden">
                    <Label className="min-h-[24px] self-center overflow-hidden text-ellipsis">
                        Розділи
                    </Label>
                    <div className="inline-flex">
                        <Button
                            variant="secondary"
                            size="icon-sm"
                            className="rounded-r-none"
                            onClick={handleRemoveEpisode}
                        >
                            <MaterialSymbolsRemoveRounded />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon-sm"
                            className="rounded-l-none"
                            onClick={handleAddEpisode}
                        >
                            <MaterialSymbolsAddRounded />
                        </Button>
                    </div>
                </div>
                <H3>
                    {isPending ? variables?.args?.chapters : read.chapters}
                    <Label className="text-muted-foreground text-sm font-normal">
                        /{read.content.chapters || '?'}
                    </Label>
                </H3>
                <Progress
                    className="mt-2 h-2"
                    max={read.content.chapters || read.chapters}
                    value={
                        isPending ? variables?.args?.chapters : read.chapters
                    }
                />
            </div>
        </div>
    );
};

export default ReadStats;
