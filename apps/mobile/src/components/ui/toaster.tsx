import type { ComponentProps, FC, PropsWithChildren } from 'react';

import {
    CircleCheck,
    Info,
    LoaderCircle,
    OctagonX,
    TriangleAlert,
} from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FullWindowOverlay } from 'react-native-screens';
import { Toaster as Sonner } from 'sonner-native';
import { useResolveClassNames } from 'uniwind';

import { Icon } from './icon';
import { DENSE_MAX_FONT_SCALE } from './typography';

type Props = ComponentProps<typeof Sonner>;

// The overlay renders above the app's gesture root, so swipe-to-dismiss needs one of its own.
const ToasterOverlay: FC<PropsWithChildren> = ({ children }) => {
    const root = (
        <GestureHandlerRootView
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}
        >
            {children}
        </GestureHandlerRootView>
    );

    return Platform.OS === 'ios' ? (
        <FullWindowOverlay>{root}</FullWindowOverlay>
    ) : (
        root
    );
};

const Toaster: FC<Props> = (props) => {
    const toast = useResolveClassNames(
        'rounded-lg border border-border bg-popover',
    );
    const title = useResolveClassNames('font-medium text-sm text-foreground');
    const description = useResolveClassNames('text-sm text-muted-foreground');
    const actionButton = useResolveClassNames('rounded-md bg-primary');
    const actionText = useResolveClassNames(
        'font-medium text-sm text-primary-foreground',
    );
    const cancelButton = useResolveClassNames('rounded-md bg-muted');
    const cancelText = useResolveClassNames(
        'font-medium text-sm text-muted-foreground',
    );

    return (
        <Sonner
            theme="system"
            position="top-center"
            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
            ToasterOverlayWrapper={ToasterOverlay}
            icons={{
                success: <Icon as={CircleCheck} />,
                info: <Icon as={Info} />,
                warning: <Icon as={TriangleAlert} />,
                error: <Icon as={OctagonX} />,
                loading: <Icon as={LoaderCircle} />,
            }}
            toastOptions={{
                style: toast,
                titleStyle: title,
                descriptionStyle: description,
                actionButtonStyle: actionButton,
                actionButtonTextStyle: actionText,
                cancelButtonStyle: cancelButton,
                cancelButtonTextStyle: cancelText,
            }}
            {...props}
        />
    );
};

export { Toaster };
