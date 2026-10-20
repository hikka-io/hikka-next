import type { ComponentProps, ReactElement } from 'react';

import { View } from 'react-native';

import PosterRow from '@/components/poster-row';
import { Header, HeaderTitle } from '@/components/ui/header';

type Props<T> = ComponentProps<typeof PosterRow<T>> & {
    title: string;
};

function AppearanceSection<T>({
    title,
    ...row
}: Props<T>): ReactElement | null {
    if (!row.isPending && !row.error && !row.list?.length) {
        return null;
    }

    return (
        <View className="mt-6 gap-3">
            <Header className="px-4">
                <HeaderTitle>{title}</HeaderTitle>
            </Header>
            <PosterRow {...row} />
        </View>
    );
}

export default AppearanceSection;
