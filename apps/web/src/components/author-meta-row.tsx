import type { FC } from 'react';

import type { Locale } from 'date-fns';

import { RoleBadge } from '@/components/badges';
import RelativeTime from '@/components/relative-time';
import { Label } from '@/components/ui/label';
import { Link } from '@/utils/navigation';

type Props = {
    username: string | null;
    created: number;
    role?: string | null;
    locale?: Locale;
};

const AuthorMetaRow: FC<Props> = ({ username, created, role, locale }) => {
    return (
        <div className="flex min-w-0 items-center gap-2">
            {username ? (
                <Label asChild className="truncate">
                    <Link to={`/u/${username}`}>{username}</Link>
                </Label>
            ) : (
                <Label className="truncate text-muted-foreground">
                    Видалений користувач
                </Label>
            )}
            <RoleBadge role={role} variant="inline" />
            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
            <RelativeTime value={created} locale={locale} />
        </div>
    );
};

export default AuthorMetaRow;
