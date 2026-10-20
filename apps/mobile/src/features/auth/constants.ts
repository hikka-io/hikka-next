import { Platform } from 'react-native';

export const FALLBACK_ERROR =
    'Не вдалося зʼєднатися з Hikka. Перевірте інтернет і спробуйте ще раз';

// iOS maps autoComplete onto textContentType, and two new-password fields wedge the Strong Password overlay there.
export const CONFIRM_PASSWORD_AUTO_COMPLETE =
    Platform.OS === 'android' ? 'new-password' : undefined;
