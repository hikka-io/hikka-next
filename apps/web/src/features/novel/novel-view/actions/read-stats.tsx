'use client';

import { ContentTypeEnum, ReadStatusEnum } from '@hikka/client';
import { useCreateRead, useNovelBySlug, useReadBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';

import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { MaterialSymbolsRemoveRounded } from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

const ReadStats = () => {
    const params = useParams();

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
        <div className="flex flex-col gap-4">
            <Card>
                <Label>Оцінка</Label>
                <div className="flex items-center justify-between gap-4">
                    <Rating
                        onChange={handleRating}
                        totalStars={5}
                        precision={0.5}
                        value={read.score ? read.score / 2 : 0}
                    />
                    <P className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">
                            {read.score}
                        </span>
                        /10
                    </P>
                </div>
            </Card>
            <Card>
                <div className="flex justify-between gap-2 overflow-hidden">
                    <Label className="min-h-[24px] self-center overflow-hidden text-ellipsis">
                        Розділи
                    </Label>
                </div>

                <div className="flex w-full flex-col gap-2">
                    <P className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">
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
            </Card>
        </div>
    );
};

export default ReadStats;
