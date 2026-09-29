import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

import type { UserResponse } from '@hikka/api';

import UserCard from './user-card';

vi.mock('@/utils/navigation', () => ({
    Link: ({ to, children }: { to: string; children?: ReactNode }) => (
        <a href={to}>{children}</a>
    ),
}));

vi.mock('@/components/content-card/poster-card', () => ({
    default: () => null,
}));

const user = (role: string): UserResponse => ({
    reference: 'reference',
    updated: null,
    created: 1700000000,
    description: null,
    username: 'someone',
    cover: null,
    active: false,
    avatar: 'avatar.png',
    role,
});

const render = (role: string) =>
    renderToStaticMarkup(<UserCard user={user(role)} />);

describe('UserCard role badge', () => {
    it.each([
        ['admin', 'Адміністратор', 'text-role-admin', 'bg-role-admin/15'],
        [
            'moderator',
            'Модератор',
            'text-role-moderator',
            'bg-role-moderator/15',
        ],
    ])('colours the %s badge with the role token', (role, label, text, bg) => {
        const html = render(role);

        expect(html).toContain(label);
        expect(html).toContain(text);
        expect(html).toContain(bg);
        expect(html).not.toContain('text-white');
        expect(html).not.toContain('background-color');
    });

    it.each(['user', 'banned'])('renders no role badge for %s', (role) => {
        const html = render(role);

        expect(html).not.toContain('role-');
        expect(html).not.toContain('Користувач');
        expect(html).not.toContain('Забанений');
    });
});
