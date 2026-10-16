import type { FC } from 'react';

import { ReadListButton, WatchListButton } from '@/components/tracking';
import { useSession } from '@/services/session';

import type { FranchiseContent } from '../franchise-model';

type Props = {
    content: FranchiseContent;
    size: 'icon-sm' | 'icon-md';
};

const FranchiseListButton: FC<Props> = ({ content, size }) => {
    const { user } = useSession();

    return content.data_type === 'anime' ? (
        <WatchListButton
            slug={content.slug}
            anime={content}
            watch={content.watch[0] ?? null}
            size={size}
            disabled={!user}
        />
    ) : (
        <ReadListButton
            content_type={content.data_type}
            slug={content.slug}
            content={content}
            read={content.read[0] ?? null}
            size={size}
            disabled={!user}
        />
    );
};

export default FranchiseListButton;
