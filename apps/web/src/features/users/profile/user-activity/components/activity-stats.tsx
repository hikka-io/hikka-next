import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';

import { serviceUserStatsOptions } from '@hikka/api';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { Link, useParams } from '@/utils/navigation';

const ActivityStats: FC = () => {
    const params = useParams();
    const username = String(params.username);

    const { data } = useQuery({
        ...serviceUserStatsOptions({ path: { username } }),
        enabled: !!params.username,
    });

    if (!data) return null;

    const commentsCount = data.comments_count ?? 0;
    const editsCount = data.edits_count ?? 0;

    return (
        <div className="mt-auto flex flex-col gap-4">
            <Separator />
            <div className="-my-2 flex flex-wrap gap-1 px-2">
                <Link
                    to={`/comments/user/${username}`}
                    className={cn(
                        'flex flex-1 items-center justify-between gap-2 rounded-sm p-2 hover:bg-accent md:flex-0',
                        commentsCount === 0 && 'opacity-50',
                    )}
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <MessageCircle className="size-4 text-muted-foreground" />
                        <Label className="cursor-pointer truncate text-muted-foreground">
                            Коментарі
                        </Label>
                    </div>
                    <Label className="cursor-pointer">{commentsCount}</Label>
                </Link>
                <Link
                    to="/edit"
                    search={{ author: username }}
                    className={cn(
                        'flex flex-1 items-center justify-between gap-2 rounded-sm p-2 hover:bg-accent md:flex-0',
                        editsCount === 0 && 'opacity-50',
                    )}
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <MaterialSymbolsEditRounded className="size-4 text-muted-foreground" />
                        <Label className="cursor-pointer truncate text-muted-foreground">
                            Правки
                        </Label>
                    </div>
                    <Label className="cursor-pointer">{editsCount}</Label>
                </Link>
            </div>
        </div>
    );
};

export default ActivityStats;
