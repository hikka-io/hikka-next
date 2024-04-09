'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import useFollowingWatchList from '@/services/hooks/watch/useFollowingWatchList';
import { useModalContext } from '@/services/providers/modal-provider';

import FollowingsModal from './components/followings-modal';
import FollowingItem from './components/ui/following-item';

const Followings = () => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { list } = useFollowingWatchList({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    const filteredFollowings = list?.slice(0, 3);

    const handleOpenFollowingsModal = () => {
        openModal({
            type: 'sheet',
            title: 'Відстежується',
            side: 'right',
            content: <FollowingsModal />,
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Відстежується"
                onClick={handleOpenFollowingsModal}
            />
            <div className="flex flex-col gap-6">
                {filteredFollowings.map((item) => (
                    <FollowingItem data={item} key={item.reference} />
                ))}
            </div>
        </div>
    );
};

export default Followings;
