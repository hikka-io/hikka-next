import type { FC } from 'react';

import { RoleBadge } from '@/components/badges';
import RelativeTime from '@/components/relative-time';
import { Label, labelVariants } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type Props = {
    username: string | null;
    created: number;
    role?: string | null;
};

const AuthorMetaRow: FC<Props> = ({ username, created, role }) => {
    return (
        <div className="flex min-w-0 items-center gap-2">
            {username ? (
                <Link
                    to={`/u/${username}`}
                    className={cn(labelVariants(), 'truncate')}
                >
                    {username}
                </Link>
            ) : (
                <Label className="truncate text-muted-foreground">
                    Видалений користувач
                </Label>
            )}
            <RoleBadge role={role} variant="inline" />
            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
            <RelativeTime value={created} />
        </div>
    );
};

export default AuthorMetaRow;
