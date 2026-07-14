import { useQuery } from '@tanstack/react-query';

import { userProfileOptions } from '@hikka/api';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import RoleBadge from '@/components/role-badge';
import { Link, useParams } from '@/utils/navigation';

const UserTitle = () => {
    const params = useParams();
    const { data: user } = useQuery(
        userProfileOptions({
            path: { username: String(params.username) },
        }),
    );

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
                <Link to={`/u/${user.username}`} className="min-w-0">
                    <h3 className="truncate hover:underline">
                        {user.username}
                    </h3>
                </Link>
                <RoleBadge role={user.role} />
            </div>
            {user.description && (
                <MDViewer className="line-clamp-3 break-words text-muted-foreground text-sm leading-5">
                    {user.description}
                </MDViewer>
            )}
        </div>
    );
};

export default UserTitle;
