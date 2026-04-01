'use client';

import { ContentTypeEnum, ReadContentType } from '@hikka/client';
import { useReadingUsers, useWatchingUsers } from '@hikka/react';
import { FC, useState } from 'react';

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
import { useParams } from '@/utils/navigation';

import FollowingItem from './components/following-item';
import FollowingsModal from './followings-modal';

interface Props {
    content_type: ContentTypeEnum;
}

const Followings: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const watchListQuery = useWatchingUsers({
        slug: String(params.slug),
        options: { enabled: content_type === ContentTypeEnum.ANIME },
    });

    const readListQuery = useReadingUsers({
        slug: String(params.slug),
        contentType: content_type as ReadContentType,
        options: { enabled: content_type !== ContentTypeEnum.ANIME },
    });

    const list =
        content_type === 'anime' ? watchListQuery.list : readListQuery.list;

    if (!list || list.length === 0) {
        return null;
    }

    const filteredFollowings = list?.slice(0, 3);

    const title = (
        <span>
            Відстежується{' '}
            {list && (
                <span className="text-muted-foreground">({list.length})</span>
            )}
        </span>
    );

    return (
        <>
            <Card className="bg-secondary/20">
                <Block>
                    <Header onClick={() => setOpen(true)}>
                        <HeaderContainer>
                            <HeaderTitle variant="h4">{title}</HeaderTitle>
                        </HeaderContainer>
                        <HeaderNavButton />
                    </Header>
                    <div className="flex flex-col gap-6">
                        {filteredFollowings.map((item) => (
                            <FollowingItem
                                data={{
                                    type: 'watch' in item ? 'watch' : 'read',
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
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Відстежується">
                    <FollowingsModal content_type={content_type} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default Followings;
