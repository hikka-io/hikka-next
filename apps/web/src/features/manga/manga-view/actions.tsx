'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ReadListButton from '@/components/readlist-button/readlist-button';

import ReadStats from './components/user-read-stats';

const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <ReadListButton
                    content_type={ContentTypeEnum.MANGA}
                    disabled={!user}
                    additional
                    slug={String(params.slug)}
                />
                <ReadStats />
            </div>
        </div>
    );
};

export default Actions;
