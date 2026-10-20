import type { ComponentProps, FC } from 'react';

import { ActivityIndicator, Platform } from 'react-native';

type Props = ComponentProps<typeof ActivityIndicator>;

// Android draws the spinner in the theme's accent colour (blue); iOS draws it grey, so Android gets the muted token.
export const Spinner: FC<Props> = (props) => (
    <ActivityIndicator
        colorClassName={
            Platform.OS === 'android' ? 'accent-muted-foreground' : undefined
        }
        {...props}
    />
);
