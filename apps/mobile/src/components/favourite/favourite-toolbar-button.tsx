import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { favouriteHint, favouriteLabel } from './favourite-copy';
import type { FavouriteState } from './use-favourite';

// Compose toolbar items take image sources only; SF Symbols are iOS-only.
const ICONS =
    Platform.OS === 'android'
        ? {
              on: require('../../../assets/icons/favorite.xml'),
              off: require('../../../assets/icons/favorite-border.xml'),
          }
        : { on: 'heart.fill' as const, off: 'heart' as const };

/**
 * The favourite toggle as a header toolbar button, for pages without an inline action row.
 * A function, not a component: `Stack.Toolbar` only accepts its own item types as direct children.
 */
export function renderFavouriteToolbarButton(favourite: FavouriteState) {
    const { status, isFavourite, activeColor } = favourite;

    return (
        <Stack.Toolbar.Button
            icon={isFavourite ? ICONS.on : ICONS.off}
            tintColor={isFavourite ? activeColor : undefined}
            accessibilityLabel={favouriteLabel(favourite)}
            accessibilityHint={favouriteHint(favourite)}
            selected={isFavourite}
            disabled={status === 'loading'}
            onPress={favourite.onPress}
        />
    );
}
