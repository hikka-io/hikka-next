'use client';

import { useParams } from 'next/navigation';

import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

import useMangaInfo from '@/services/hooks/manga/use-manga-info';
import useAddRead from '@/services/hooks/read/use-add-read';
import useRead from '@/services/hooks/read/use-read';

const ReadStats = () => {
    const params = useParams();

    const { data: read, isError: readError } = useRead({
        slug: String(params.slug),
        content_type: 'manga',
    });
    const { data } = useMangaInfo({ slug: String(params.slug) });

    const { mutate: mutateAddRead, variables, isPending } = useAddRead();

    const handleAddEpisode = () => {
        if (read) {
            const chapters = (variables?.params?.chapters || read.chapters) + 1;

            if (read.content.chapters && chapters > read.content.chapters)
                return;

            let status = read.status;

            if (chapters === read.content.chapters) {
                status = 'completed';
            }

            if (!read.chapters && read.status === 'planned') {
                status = 'reading';
            }

            mutateAddRead({
                params: {
                    content_type: 'manga',
                    note: read.note,
                    volumes: read.volumes,
                    rereads: read.rereads,
                    score: read.score,
                    status,
                    slug: read.content.slug,
                    chapters,
                },
            });
        }
    };

    const handleRemoveEpisode = () => {
        if (read) {
            const chapters = (variables?.params?.chapters || read.chapters) - 1;

            if (chapters < 0) return;

            mutateAddRead({
                params: {
                    note: read.note,
                    volumes: read.volumes,
                    rereads: read.rereads,
                    score: read.score,
                    status: read.status,
                    content_type: 'manga',
                    slug: read.content.slug,
                    chapters,
                },
            });
        }
    };

    const handleRating = (value: number) => {
        if (read) {
            mutateAddRead({
                params: {
                    note: read.note,
                    volumes: read.volumes,
                    chapters: read.chapters,
                    rereads: read.rereads,
                    status: read.status,
                    content_type: 'manga',
                    slug: read.content.slug,
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
            <div className="flex justify-between gap-4 rounded-lg border border-border bg-secondary/20 p-4">
                <Rating
                    // className="rating-md lg:flex"
                    onChange={handleRating}
                    totalStars={5}
                    precision={0.5}
                    value={read.score ? read.score / 2 : 0}
                />
                <H3>
                    {read.score}
                    <Label className="text-sm font-normal text-muted-foreground">
                        /10
                    </Label>
                </H3>
            </div>
            <div className="rounded-lg border border-border bg-secondary/20 p-4">
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
                    {isPending ? variables?.params?.chapters : read.chapters}
                    <Label className="text-sm font-normal text-muted-foreground">
                        /{read.content.chapters || '?'}
                    </Label>
                </H3>
                <Progress
                    className="mt-2 h-2"
                    max={read.content.chapters || read.chapters}
                    value={
                        isPending ? variables?.params?.chapters : read.chapters
                    }
                />
            </div>
        </div>
    );
};

export default ReadStats;
