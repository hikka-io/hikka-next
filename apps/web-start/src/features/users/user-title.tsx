import { useQuery } from '@tanstack/react-query';

import { userReferenceOptions } from '@hikka/api';

import MaterialSymbolsSecurity from '@/components/icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '@/components/icons/material-symbols/MaterialSymbolsShieldPerson';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link, useParams } from '@/utils/navigation';

const UserTitle = () => {
    const params = useParams();
    const { data: user } = useQuery(
        userReferenceOptions({
            path: { reference: String(params.username) },
        }),
    );

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
                <Link to={`/u/${user.username}`}>
                    <h3 className="line-clamp-1 break-all hover:underline">
                        {user.username}
                    </h3>
                </Link>
                {(user.role === 'admin' || user.role === 'moderator') && (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className="rounded-sm border border-border bg-secondary/20 p-1 font-bold text-xs backdrop-blur">
                                {user.role === 'admin' && (
                                    <MaterialSymbolsSecurity className="text-role-admin" />
                                )}
                                {user.role === 'moderator' && (
                                    <MaterialSymbolsShieldPerson className="text-role-moderator" />
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm">
                                {user.role === 'admin'
                                    ? 'Адміністратор'
                                    : 'Модератор'}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            {user.description && (
                <MDViewer className="line-clamp-3 text-muted-foreground text-sm leading-5">
                    {user.description}
                </MDViewer>
            )}
        </div>
    );
};

export default UserTitle;
