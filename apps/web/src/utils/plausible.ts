import { useEffect } from 'react';

import { useLocation } from '@tanstack/react-router';

import { PUBLIC_API_URL } from '@/utils/api/base-url';

const DOMAIN = 'hikka.io';
const INTERACTION_EVENTS = [
    'pointerdown',
    'pointermove',
    'keydown',
    'touchstart',
    'wheel',
];

let hasInteracted = false;
let pendingPageviewUrl: string | undefined;
let lastPathname: string | undefined;

function isIgnored() {
    if (
        /^localhost$|^127(\.\d+){0,2}\.\d+$|^\[::1?\]$/.test(
            window.location.hostname,
        ) ||
        navigator.webdriver ||
        /headless|lighthouse|pagespeed|phantomjs/i.test(navigator.userAgent)
    ) {
        return true;
    }

    try {
        return localStorage.getItem('plausible_ignore') === 'true';
    } catch {
        return false;
    }
}

function sendEvent(name: string, url = window.location.href) {
    if (isIgnored()) return;

    fetch(`${PUBLIC_API_URL}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            n: name,
            u: url,
            d: DOMAIN,
            r: document.referrer || null,
        }),
        keepalive: true,
    }).catch(() => undefined);
}

function stopListening() {
    for (const type of INTERACTION_EVENTS) {
        window.removeEventListener(type, handleInteraction, true);
    }
}

// Bots rarely produce real input, so the pageview waits for the first trusted one.
function handleInteraction(event: Event) {
    if (!event.isTrusted) return;

    hasInteracted = true;
    stopListening();

    if (pendingPageviewUrl) {
        sendEvent('pageview', pendingPageviewUrl);
        pendingPageviewUrl = undefined;
    }
}

function trackPageview(href: string) {
    const url = new URL(href, window.location.origin);

    if (url.pathname === lastPathname) return;
    lastPathname = url.pathname;

    if (hasInteracted) {
        sendEvent('pageview', url.href);
    } else {
        pendingPageviewUrl = url.href;
    }
}

export function usePlausiblePageviews() {
    const href = useLocation({ select: (location) => location.publicHref });

    useEffect(() => {
        if (hasInteracted) return;

        for (const type of INTERACTION_EVENTS) {
            window.addEventListener(type, handleInteraction, {
                capture: true,
                passive: true,
            });
        }

        return stopListening;
    }, []);

    useEffect(() => {
        trackPageview(href);
    }, [href]);
}

export type PlausibleEvents = {
    'movie-banner-click': never;
};

export function usePlausible<
    T extends Record<string, never> = Record<string, never>,
>() {
    return (event: keyof T & string) => sendEvent(event);
}
