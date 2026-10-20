import { Platform } from 'react-native';

export const CHEVRON_ICON = require('../../../assets/icons/chevron-right.xml');
export const CHECK_ICON = require('../../../assets/icons/check.xml');

/** Compose toolbar items take image sources only; SF Symbols are iOS-only. */
export const SETTINGS_ICON =
    Platform.OS === 'android'
        ? require('../../../assets/icons/settings.xml')
        : 'gearshape';
