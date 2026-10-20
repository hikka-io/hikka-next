import type { ComponentProps, ReactElement } from 'react';

import PosterRow from '@/components/content-card/poster-row';

type Props<T> = ComponentProps<typeof PosterRow<T>> & {
    title: string;
};

function AppearanceSection<T>(props: Props<T>): ReactElement | null {
    if (props.items?.length === 0 && !props.error) {
        return null;
    }

    return <PosterRow {...props} className="mt-6 px-4" />;
}

export default AppearanceSection;
