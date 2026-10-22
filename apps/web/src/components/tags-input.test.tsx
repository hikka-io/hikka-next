import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import TagsInput from './tags-input';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    document.body.innerHTML = '';
});

async function render(initial: string[]) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    teardown.push(() => root.unmount());
    const current = { tags: initial };

    const Harness = () => {
        const [tags, setTags] = useState(initial);
        current.tags = tags;
        return <TagsInput tags={tags} onChange={setTags} />;
    };

    await act(async () => root.render(<Harness />));

    return { container, current };
}

const openInput = async (container: HTMLElement) => {
    const chip = [...container.querySelectorAll('button')].find(
        (element) => element.textContent?.trim() === 'Тег',
    );
    await act(async () => chip?.click());
    return container.querySelector<HTMLInputElement>(
        'input[aria-label="Новий тег"]',
    );
};

const typeAndCommit = (input: HTMLInputElement, value: string) =>
    act(async () => {
        Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
        )?.set?.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
        );
    });

describe('TagsInput', () => {
    it('adds a valid tag in its normalized form', async () => {
        const { container, current } = await render([]);
        const input = await openInput(container);
        if (!input) throw new Error('the tag input did not open');

        await typeAndCommit(input, ' Огляд ');

        expect(current.tags).toEqual(['огляд']);
    });

    it.each([
        ['an invalid tag', 'топ10'],
        ['a tag already added', 'огляд'],
    ])('skips %s', async (_, tag) => {
        const { container, current } = await render(['огляд']);
        const input = await openInput(container);
        if (!input) throw new Error('the tag input did not open');

        await typeAndCommit(input, tag);

        expect(current.tags).toEqual(['огляд']);
    });

    it('removes a tag from its badge', async () => {
        const { container, current } = await render(['огляд', 'новини']);

        await act(async () =>
            container
                .querySelector<HTMLButtonElement>(
                    'button[aria-label="Прибрати тег огляд"]',
                )
                ?.click(),
        );

        expect(current.tags).toEqual(['новини']);
    });

    it('stops offering new tags at the backend limit', async () => {
        const { container } = await render(
            ['один', 'два', 'три'].slice(0, API_LIMITS.tags.max),
        );

        expect(await openInput(container)).toBeNull();
    });
});
