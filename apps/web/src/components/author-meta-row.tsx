import type { FC } from 'react';

import { formatDistance, type Locale } from 'date-fns';

import RoleBadge from '@/components/role-badge';
import { Label } from '@/components/ui/label';
import { Link } from '@/utils/navigation';

type Props = {
    username: string;
    created: number;
    role?: string | null;
    locale?: Locale;
};

const AuthorMetaRow: FC<Props> = ({ username, created, role, locale }) => {
    return (
        <div className="flex min-w-0 items-center gap-2">
            <Label asChild className="truncate">
                <Link to={`/u/${username}`}>{username}</Link>
            </Label>
            <RoleBadge role={role} variant="inline" />
            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
            <span className="shrink-0 text-muted-foreground text-xs">
                {formatDistance(created * 1000, Date.now(), {
                    addSuffix: true,
                    locale,
                })}
            </span>
        </div>
    );
};

export default AuthorMetaRow;
