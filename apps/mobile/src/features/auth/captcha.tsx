import type { FC } from 'react';

import { Linking, useColorScheme } from 'react-native';
import { WebView } from 'react-native-webview';

import { CAPTCHA_ORIGIN, CAPTCHA_SITE_KEY } from './captcha-config';

const WIDGET_WIDTH = 300;
const WIDGET_HEIGHT = 65;

const widgetPage = (theme: 'light' | 'dark') => `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<style>html,body{margin:0;background:transparent}</style>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad" async defer></script>
</head>
<body>
<div id="widget"></div>
<script>
const send = (token) => window.ReactNativeWebView.postMessage(token ?? '');
window.onTurnstileLoad = () => turnstile.render('#widget', {
    sitekey: '${CAPTCHA_SITE_KEY}',
    theme: '${theme}',
    language: 'uk',
    callback: send,
    'expired-callback': () => send(null),
    'error-callback': () => send(null),
});
</script>
</body>
</html>`;

type Props = {
    onToken: (token: string | undefined) => void;
};

const Captcha: FC<Props> = ({ onToken }) => {
    const theme = useColorScheme() === 'dark' ? 'dark' : 'light';

    return (
        <WebView
            source={{ html: widgetPage(theme), baseUrl: CAPTCHA_ORIGIN }}
            style={{
                width: WIDGET_WIDTH,
                height: WIDGET_HEIGHT,
                backgroundColor: 'transparent',
            }}
            scrollEnabled={false}
            onMessage={(event) => onToken(event.nativeEvent.data || undefined)}
            onShouldStartLoadWithRequest={(request) => {
                if (
                    !request.isTopFrame ||
                    request.url.startsWith(CAPTCHA_ORIGIN) ||
                    request.url.startsWith('about:')
                ) {
                    return true;
                }
                Linking.openURL(request.url);
                return false;
            }}
        />
    );
};

export default Captcha;
