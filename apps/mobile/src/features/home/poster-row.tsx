import type { FC, PropsWithChildren } from 'react';

import { ScrollView, View } from 'react-native';

const POSTER_WIDTH = 128;

export const PosterRow: FC<PropsWithChildren> = ({ children }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 px-4"
            className="-mx-4"
        >
            {children}
        </ScrollView>
    );
};

export const PosterRowItem: FC<PropsWithChildren> = ({ children }) => {
    return <View style={{ width: POSTER_WIDTH }}>{children}</View>;
};
