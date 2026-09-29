import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    type EditSimpleResponse,
    EditStatusEnum,
    type UserResponse,
} from '@hikka/api';

import { badgeVariants } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { EDIT_STATUS } from '@/utils/labels/enum-labels';

import EditCard from './content-edits/edit-card';
import EditRow from './edit-list/components/edit-row';
import EditStatusBadge from './edit-status-badge';
import { EDIT_STATUS_STYLE } from './edit-status-style';

const mocks = vi.hoisted(() => ({
    edit: undefined as EditSimpleResponse | undefined,
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useQuery: () => ({ data: mocks.edit }),
}));

vi.mock('@/services/session', () => ({ useTitle: () => 'Title' }));

vi.mock('@/utils/navigation', () => ({
    Link: ({ to, ...props }: { to: string; children?: ReactNode }) => (
        <a href={to} {...props} />
    ),
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/content-card/poster-card', () => ({
    default: () => null,
}));

const author: UserResponse = {
    reference: 'reference',
    updated: null,
    created: 1700000000,
    description: null,
    username: 'someone',
    cover: null,
    active: false,
    avatar: 'avatar.png',
    role: 'user',
};

const edit = (status: EditStatusEnum): EditSimpleResponse => ({
    content_type: 'anime',
    status,
    created: 1700000000,
    updated: 1700000000,
    description: null,
    edit_id: 7,
    moderator: null,
    author,
    before: null,
    system_edit: false,
    after: { synopsis_ua: 'text' },
    content: { slug: 'some-anime' },
});

const mount = (html: string) => {
    const root = document.createElement('div');
    root.innerHTML = html;
    return root;
};

const statusBadgeClass = (root: HTMLElement, status: EditStatusEnum) =>
    Array.from(root.querySelectorAll('div'))
        .filter((node) => node.textContent === EDIT_STATUS[status].title_ua)
        .at(-1)?.className;

const VARIANTS = [
    [EditStatusEnum.PENDING, 'warning'],
    [EditStatusEnum.ACCEPTED, 'success'],
    [EditStatusEnum.DENIED, 'destructive'],
    [EditStatusEnum.CLOSED, 'secondary'],
] as const;

afterEach(() => {
    mocks.edit = undefined;
});

describe('edit status variants', () => {
    it.each(VARIANTS)('maps %s to the %s variant', (status, variant) => {
        expect(EDIT_STATUS_STYLE[status].variant).toBe(variant);
    });

    it.each(
        VARIANTS,
    )('renders the %s edit card link as %s', (status, variant) => {
        const root = mount(
            renderToStaticMarkup(<EditCard edit={edit(status)} to="/edit/7" />),
        );

        expect(root.querySelector('a[href="/edit/7"]')?.className).toBe(
            cn(buttonVariants({ variant, size: 'md' })),
        );
    });

    it.each(
        VARIANTS,
    )('renders the %s edit row badge as %s', (status, variant) => {
        const root = mount(
            renderToStaticMarkup(
                <table>
                    <tbody>
                        <EditRow edit={edit(status)} />
                    </tbody>
                </table>,
            ),
        );

        expect(statusBadgeClass(root, status)).toBe(
            cn(badgeVariants({ variant }), 'size-auto p-0 px-1.5'),
        );
    });

    it.each(
        VARIANTS,
    )('renders the %s edit status badge as %s', (status, variant) => {
        mocks.edit = edit(status);
        const root = mount(
            renderToStaticMarkup(<EditStatusBadge editId="7" />),
        );

        expect(statusBadgeClass(root, status)).toBe(
            cn(badgeVariants({ variant })),
        );
    });
});
