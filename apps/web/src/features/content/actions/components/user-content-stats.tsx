import { Hash, Star } from 'lucide-react';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadResponse,
    type WatchResponse,
} from '@hikka/api';

import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRemoveRounded from '@/components/icons/material-symbols/MaterialSymbolsRemoveRounded';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Rating from '@/components/ui/rating';

import { useUserlistManager } from '../../hooks/use-list-manager';

const UserContentStats = ({
    content_type,
    listItem,
}: {
    content_type: MainContentTypeEnum;
    listItem?: WatchResponse | ReadResponse;
}) => {
    const { addProgress, removeProgress, setScore, score, progress, total } =
        useUserlistManager({
            listItem,
            content_type,
        });

    if (!listItem) {
        return null;
    }

    const unit = content_type === ContentTypeEnum.ANIME ? 'епізод' : 'розділ';

    return (
        <div className="surface flex flex-col divide-y divide-border overflow-hidden rounded-md rounded-t-none border">
            <div className="flex items-center justify-between gap-4 p-4">
                <p className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Star className="size-4" />
                    <span>
                        <span className="font-bold text-foreground">
                            {score ?? 0}
                        </span>
                        /10
                    </span>
                </p>
                <Rating
                    onChange={setScore}
                    totalStars={5}
                    precision={0.5}
                    value={score ? score / 2 : 0}
                />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Hash className="size-4" />
                        <span>
                            <span className="font-bold text-foreground">
                                {progress}
                            </span>
                            /{total ?? '?'}{' '}
                            {content_type === ContentTypeEnum.ANIME
                                ? 'епізодів'
                                : 'розділів'}
                        </span>
                    </p>
                    <Progress
                        className="h-2"
                        max={total || progress || 1}
                        value={progress}
                    />
                </div>
                <div className="flex">
                    <Button
                        variant="secondary"
                        size="icon-md"
                        onClick={removeProgress}
                        aria-label={`Прибрати ${unit}`}
                        className="rounded-r-none"
                    >
                        <MaterialSymbolsRemoveRounded />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon-md"
                        onClick={addProgress}
                        aria-label={`Додати ${unit}`}
                        className="rounded-l-none"
                    >
                        <MaterialSymbolsAddRounded />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserContentStats;
