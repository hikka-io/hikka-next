import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import type { MainContentTypeEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import ContentRailSkeleton from '../content-rail-skeleton';
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

    if (!list) {
        return user && isPending ? (
            <div ref={ref}>
                <ContentRailSkeleton className="gap-6">
                    {range(0, FOLLOWING_PREVIEW_SIZE).map((index) => (
                        <FollowingItemSkeleton key={index} />
                    ))}
                </ContentRailSkeleton>
            </div>
        ) : null;
    }

    if (list.length === 0) {
        return null;
    }

    const title = (
        <span>
            Відстежується{' '}
            {pagination && (
                <span className="text-muted-foreground">
                    ({pagination.total})
                </span>
            )}
        </span>
    );

    return (
        <>
            <div ref={ref}>
                <Card id="content-followings">
                    <Block>
                        <Header onClick={() => setOpen(true)}>
                            <HeaderContainer>
                                <HeaderTitle variant="h4">{title}</HeaderTitle>
                            </HeaderContainer>
                            <HeaderNavButton />
                        </Header>
                        <div className="flex flex-col gap-6">
                            {list.map((item) => (
                                <FollowingItem
                                    data={{
                                        type:
                                            'watch' in item ? 'watch' : 'read',
                                        content:
                                            'watch' in item
                                                ? item.watch
                                                : item.read,
                                        ...item,
                                    }}
                                    key={item.reference}
                                />
                            ))}
                        </div>
                    </Block>
                </Card>
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
