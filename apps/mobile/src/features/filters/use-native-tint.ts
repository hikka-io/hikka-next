import { tint } from '@expo/ui/swift-ui/modifiers';
import { Platform } from 'react-native';
import { useCSSVariable } from 'uniwind';

/** SwiftUI controls take the app tint (DESIGN §2); Compose keeps its Material colours. */
export function useNativeTint() {
    const color = useCSSVariable('--color-primary-foreground');

    return Platform.OS === 'ios' && typeof color === 'string'
        ? [tint(color)]
        : undefined;
}
