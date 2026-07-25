import type { FC, MouseEvent } from 'react';

import { ChevronRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { SessionUser } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';
import { USER_ROLE } from '@/utils/constants/common';
import { Link } from '@/utils/navigation';

type Props = {
    user: SessionUser;
    className?: string;
    onNavigate?: () => void;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    [key: string]: unknown;
};

const ProfileIdentity: FC<Props> = ({
    user,
    className,
    onNavigate,
    onClick,
    ...props
}) => {
    return (
        <Link
            {...props}
            to={`/u/${user.username}`}
            // Rendered through DropdownMenuItem's asChild, whose own onClick
            // drives selection — keep it alongside ours.
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                onClick?.(event);
                onNavigate?.();
            }}
            className={cn(
                'surface-inset flex items-center gap-2 rounded-md border p-2 transition-colors hover:bg-accent',
                className,
            )}
        >
            <Avatar className="size-10 rounded-md">
                <AvatarImage src={user.avatar} alt="pfp" />
                <AvatarFallback className="rounded-md">
                    {user.username[0]}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium text-sm">
                    {user.username}
                </span>
                <span className="truncate text-muted-foreground text-xs">
                    {USER_ROLE[user.role].label}
                </span>
            </div>
            <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground/50" />
        </Link>
    );
};

export default ProfileIdentity;
