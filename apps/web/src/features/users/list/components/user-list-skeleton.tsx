import type { FC } from 'react';

import { range } from '@antfu/utils';

import type { MainContentTypeEnum } from '@hikka/api';

import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import Stack, { type StackSize } from '@/components/ui/stack';
import type { View } from '@/utils/cookies';

import { DEFAULT_PAGE_SIZE } from '../../queries';
import TableView from '../table-view';

type Props = {
    view: View;
    content_type: MainContentTypeEnum;
    extendedSize?: StackSize;
};

const UserListSkeleton: FC<Props> = ({
    view,
    content_type,
    extendedSize = 5,
}) => {
    if (view === 'table') {
        return <TableView content_type={content_type} />;
    }

    return (
        <Stack size={5} extendedSize={extendedSize} extended>
            {range(0, DEFAULT_PAGE_SIZE).map((index) => (
                <PosterCardSkeleton key={index} />
            ))}
        </Stack>
    );
};

export default UserListSkeleton;
