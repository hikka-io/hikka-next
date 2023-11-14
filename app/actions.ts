'use server';

import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string) {
    cookies().set(name, value);
}

export async function deleteCookie(name: string) {
    cookies().delete(name);
}

export async function getCookie(name: string) {
    return cookies().get(name)?.value;
}

export async function getCookies(name: string) {
    return cookies().getAll(name);
}