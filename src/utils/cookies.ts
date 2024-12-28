'use server';

import { cookies } from 'next/headers';

export async function setCookie(name: string, value: string) {
    console.log(process.env.COOKIE_DOMAIN, process.env.COOKIE_HTTP_ONLY);

    (await cookies()).set(name, value, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        sameSite: 'lax',
        domain: process.env.COOKIE_DOMAIN,
    });
}

export async function deleteCookie(name: string) {
    return (await cookies()).delete(name);
}

export async function getCookie(name: string) {
    return (await cookies()).get(name)?.value;
}

export async function getCookies() {
    return (await cookies()).getAll().values();
}
