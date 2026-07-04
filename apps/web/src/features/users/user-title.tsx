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
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
                <Link to={`/u/${user.username}`}>
                    <h3 className="line-clamp-1 break-all hover:underline">
                        {user.username}
                    </h3>
                </Link>
                <RoleBadge role={user.role} />
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
