import Link from 'next/link';

import { MaterialSymbolsKidStar } from '@/components/icons/material-symbols/MaterialSymbolsKidStar';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/utils';

interface Props {
    user: API.User;
    rank: number;
    accepted: number;
    closed: number;
    denied: number;
}

const Component = ({ user, rank, accepted, denied, closed }: Props) => {
    return (
        <div
            className={cn(
                'relative flex min-w-0 flex-1 items-center gap-4 rounded-md px-6 py-4',
            )}
        >
            <Label className="text-muted-foreground">{rank}</Label>
            <Link href={`/u/${user.username}`}>
                <Avatar className="size-12 rounded-md">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="size-12 rounded-md" />
                </Avatar>
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                    className="truncate font-bold"
                    href={`/u/${user.username}`}
                >
                    {user.username}
                </Link>

                <div className="flex gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-success" />
                        <Small>{accepted}</Small>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-destructive" />
                        <Small>{denied}</Small>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex size-2 items-center justify-center rounded-full bg-muted-foreground" />
                        <Small>{closed}</Small>
                    </div>
                </div>
            </div>
            {rank <= 3 && (
                <MaterialSymbolsKidStar
                    className={cn(
                        'text-lg',
                        rank === 1
                            ? 'text-yellow-300'
                            : rank === 2
                              ? 'text-slate-300'
                              : 'text-amber-700',
                    )}
                />
            )}
        </div>
    );
};

export default Component;
