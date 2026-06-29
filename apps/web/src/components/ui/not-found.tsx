import type { PropsWithChildren, ReactNode } from 'react';

import EmptyState from '@/components/ui/empty-state';

type Props = PropsWithChildren & {
    title: string | ReactNode;
    description?: string | ReactNode;
};

/**
 * @deprecated Use `EmptyState` from `@/components/ui/empty-state` instead.
 * Forwards to `EmptyState` to keep existing call sites compiling during the
 * empty-state migration. Removed once all consumers are migrated.
 */
const NotFound = ({ title, description, children }: Props) => {
    return (
        <EmptyState
            title={title}
            description={description}
            action={children}
            bordered
        />
    );
};

export default NotFound;
