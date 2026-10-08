import { format } from 'date-fns/format';

import type { UserResponse } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { USER_ROLE } from '@/utils/labels';
import { Link } from '@/utils/navigation';

const ROLE_BADGE_CLASSES = {
    admin: 'border-role-admin/40 bg-role-admin/15 text-role-admin',
    moderator:
        'border-role-moderator/40 bg-role-moderator/15 text-role-moderator',
} as const;

type Props = {
    user: UserResponse;
    type?: 'link' | 'button';
};

const UserCard = ({ user, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            to={`/u/${user.username}`}
            className="flex w-full items-center gap-4 text-left"
        >
            <div className="w-12">
                <PosterCard image={user.avatar} containerRatio={1} />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {user.username}
                    </Label>

                    {user.active && (
                        <div className="-right-2 -bottom-2 z-1 size-2 rounded-full border border-success bg-success-foreground" />
                    )}

                    {(user.role === 'admin' || user.role === 'moderator') && (
                        <Badge
                            className={cn(
                                'text-xs',
                                ROLE_BADGE_CLASSES[user.role],
                            )}
                            variant="status"
                        >
                            {USER_ROLE[user.role].label}
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-muted-foreground text-xs">
                            {format(
                                new Date(user.created * 1000),
                                'd MMMM yyyy',
                            )}
                        </Label>
                    </div>
                </div>
            </div>
        </Comp>
    );
};

export default UserCard;
