import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import type { MainContentTypeEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import { contentFollowingOptions, FOLLOWING_PREVIEW_SIZE } from '../queries';
import FollowingItem from './components/following-item';
import FollowingItemSkeleton from './components/following-item-skeleton';
import FollowingsModal from './followings-modal';

type Props = {
    content_type: MainContentTypeEnum;
};

const Followings: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { user } = useSession();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { ref, visible } = useVisibleOnce();
    const { list, pagination, isPending } = useInfiniteList(
        contentFollowingOptions(content_type, String(params.slug), {
            preview: true,
        }),
        { enabled: !!user && visible },
    );

    if (!list ? !user || !isPending : list.length === 0) {
        return null;
    }

    return (
        <>
            <div ref={ref}>
                <Block variant="card" id="content-followings">
                    <Header>
                        <HeaderTitle
                            onClick={() => setOpen(true)}
                            count={pagination?.total}
                            countPending={!list}
                        >
                            Відстежується
                        </HeaderTitle>
                    </Header>
                    <div className="flex flex-col gap-6">
                        {!list &&
                            range(0, FOLLOWING_PREVIEW_SIZE).map((index) => (
                                <FollowingItemSkeleton key={index} />
                            ))}
                        {list?.map((item) => (
                            <FollowingItem user={item} key={item.reference} />
                        ))}
                    </div>
                </Block>
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="left" title="Відстежується">
                    <FollowingsModal content_type={content_type} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default Followings;
