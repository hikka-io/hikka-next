'use client';

import { useParams } from 'next/navigation';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import useFollowingWatchList from '@/services/hooks/watch/use-following-watch-list';
import { useModalContext } from '@/services/providers/modal-provider';

import FollowingItem from './following-item';
import FollowingsModal from './followings-modal';

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
        <Block>
            <Header title="Відстежується" onClick={handleOpenFollowingsModal} />
            <div className="flex flex-col gap-6">
                {filteredFollowings.map((item) => (
                    <FollowingItem data={item} key={item.reference} />
                ))}
            </div>
        </Block>
    );
};

export default Followings;
