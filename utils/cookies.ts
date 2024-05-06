'use server';

import { cookies } from 'next/headers';

export async function setCookie(name: string, value: string) {
    cookies().set(name, value, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: 'lax',
    });
}

export async function deleteCookie(name: string) {
    cookies().delete(name);
}

export async function getCookie(name: string) {
    return cookies().get(name)?.value;
}

export async function getCookies() {
    return cookies().getAll().values();
}
