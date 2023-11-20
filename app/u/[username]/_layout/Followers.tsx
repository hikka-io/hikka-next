'use client';

import Image from '@/app/_components/Image';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import getFollowers from '@/utils/api/follow/getFollowers';

interface Props {}

const Component = ({}: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['followers', params.username],
        queryFn: () => getFollowers({ username: String(params.username) }),
        staleTime: 0,
    });

    if (!data) {
        return null;
    }

    if (data.list.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3>Стежать</h3>
                <Link href="#" className="btn btn-outline btn-secondary btn-xs">{data.pagination.total}</Link>
            </div>
            <div className="grid grid-cols-5 gap-4">
                {data.list.slice(0, 10).map((user) => (
                    <Link key={user.reference} href={`/u/${user.username}`}>
                        <div className="avatar">
                            <div className="w-full rounded-lg">
                                <Image
                                    alt="avatar"
                                    className="object-contain"
                                    width={287}
                                    height={287}
                                    src={user.avatar}
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Component;
