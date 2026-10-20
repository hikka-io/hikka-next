import { Platform } from 'react-native';

/** The tap box of a native menu trigger: 48 dp on Android (Material minimum), 44 pt on iOS. */
export const MENU_TRIGGER_SIZE = Platform.OS === 'android' ? 48 : 44;
