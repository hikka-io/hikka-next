import { openBrowserAsync } from 'expo-web-browser';

const WEB_ORIGIN = 'https://hikka.io';

export const openWebPage = (path: string) =>
    openBrowserAsync(`${WEB_ORIGIN}${path}`);
