'use client';

import { ContentTypeEnum } from '@hikka/client';
import { Hash, Star } from 'lucide-react';
import { useParams } from 'next/navigation';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

import { useSettingsStore } from '@/services/stores/settings-store';
import { CONTENT_CONFIG } from '@/utils/constants/common';

import { useUserlistManager } from '../hooks/use-list-manager';

const UserContentStats = ({
    content_type,
}: {
    content_type:
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL
        | ContentTypeEnum.ANIME;
}) => {
    const { collapsibles, setCollapsibles } = useSettingsStore();
    const params = useParams();

    const { data: userlist, isError: userlistError } = CONTENT_CONFIG[
        content_type
    ].useUserlistRecord(String(params.slug));

    const { addProgress, removeProgress, setScore, score, progress, total } =
        useUserlistManager({
            listItem: userlist,
            content_type,
        });

    if (!userlist || userlistError) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <CollapsibleFilter
                title="Оцінка"
                icon={<Star className="size-4" />}
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
                        onChange={setScore}
                        totalStars={5}
                        precision={0.5}
                        value={score ? score / 2 : 0}
                    />
                    <P className="text-muted-foreground text-sm">
                        <span className="text-foreground font-bold">
                            {score}
                        </span>
                        /10
                    </P>
                </div>
            </CollapsibleFilter>
            <CollapsibleFilter
                title={
                    content_type === ContentTypeEnum.ANIME
                        ? 'Епізоди'
                        : 'Розділи'
                }
                icon={<Hash className="size-4" />}
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
                            {progress}
                        </span>
                        /{total ?? '?'}{' '}
                        {content_type === ContentTypeEnum.ANIME
                            ? 'епізодів'
                            : 'розділів'}
                    </P>
                    <Progress
                        className="h-2"
                        max={total ?? 0}
                        value={progress}
                    />
                </div>
                <div className="flex">
                    <Button
                        className="flex-1 rounded-r-none"
                        onClick={addProgress}
                        variant="secondary"
                        size="md"
                    >
                        <MaterialSymbolsAddRounded />
                        <div className="flex gap-1">
                            <span className="hidden sm:block">Додати</span>
                            <span className="capitalize sm:normal-case">
                                {content_type === ContentTypeEnum.ANIME
                                    ? 'епізод'
                                    : 'розділ'}
                            </span>
                        </div>
                    </Button>
                    <Button
                        className="rounded-l-none"
                        onClick={removeProgress}
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

export default UserContentStats;
