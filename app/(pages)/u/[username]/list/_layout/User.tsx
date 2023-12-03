'use client';

import Image from '@/app/_components/Image';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getUserInfo from '@/utils/api/user/getUserInfo';
import Link from 'next/link';

interface Props {}

const Component = ({}: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['user', params.username],
        queryFn: () => getUserInfo({ username: String(params.username) }),
    });

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                    <div className="w-full rounded-lg">
                        <Image
                            alt="avatar"
                            className="object-contain"
                            width={287}
                            height={287}
                            src={data.avatar}
                        />
                    </div>
                </div>
                <h3>{data.username}</h3>
                <Link
                    href={`/u/${data.username}`}
                    className="btn btn-outline bg-secondary/60 flex-1 join-item btn-md w-full"
                >
                    Профіль
                </Link>
            </div>
        </div>
    );
};

export default Component;
