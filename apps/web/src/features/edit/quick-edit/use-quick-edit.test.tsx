import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { ContentTypeEnum, EditContentTypeEnum } from '@hikka/api';

import { useQuickEdit } from './use-quick-edit';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const session = vi.hoisted(() => ({ moderator: false }));

vi.mock('@/services/session/use-session', () => ({
    useSession: () => ({ isModerator: () => session.moderator }),
}));

vi.mock('./quick-edit-modal', () => ({
    default: ({
        open,
        onOpenChange,
    }: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
    }) => (
        <button
            type="button"
            data-testid="quick-edit-modal"
            data-open={String(open)}
            onClick={() => onOpenChange(false)}
        />
    ),
}));

type QuickEdit = ReturnType<typeof useQuickEdit>;

const teardown: (() => void)[] = [];

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    session.moderator = false;
});

function Harness({
    contentType,
    onRender,
}: {
    contentType: ContentTypeEnum;
    onRender: (quickEdit: QuickEdit) => void;
}) {
    const quickEdit = useQuickEdit(contentType, 'slug');
    onRender(quickEdit);

    return quickEdit.modal;
}

async function render(contentType: ContentTypeEnum) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    let latest: QuickEdit | undefined;

    await act(async () =>
        root.render(
            <Harness
                contentType={contentType}
                onRender={(quickEdit) => {
                    latest = quickEdit;
                }}
            />,
        ),
    );
    teardown.push(() => {
        root.unmount();
        container.remove();
    });

    return {
        container,
        current: () => {
            if (!latest) throw new Error('hook did not render');

            return latest;
        },
    };
}

const flush = () =>
    act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });

const modalOf = (container: HTMLElement) =>
    container.querySelector<HTMLButtonElement>(
        '[data-testid="quick-edit-modal"]',
    );

describe('useQuickEdit', () => {
    it('denies quick edit to non-moderators', async () => {
        const { current } = await render(ContentTypeEnum.ANIME);

        expect(current().canQuickEdit).toBe(false);
    });

    it.each(Object.values(EditContentTypeEnum))(
        'allows moderators to quick edit %s',
        async (contentType) => {
            session.moderator = true;
            const { current } = await render(contentType);

            expect(current().canQuickEdit).toBe(true);
        },
    );

    it.each([
        ContentTypeEnum.ARTICLE,
        ContentTypeEnum.COLLECTION,
        ContentTypeEnum.COMMENT,
        ContentTypeEnum.EDIT,
        ContentTypeEnum.USER,
    ])('denies moderators quick edit of %s', async (contentType) => {
        session.moderator = true;
        const { current } = await render(contentType);

        expect(current().canQuickEdit).toBe(false);
    });

    it('renders no modal until opened, then keeps it mounted after close', async () => {
        session.moderator = true;
        const { container, current } = await render(ContentTypeEnum.ANIME);

        expect(current().modal).toBeNull();
        expect(modalOf(container)).toBeNull();

        await act(async () => current().openDeferred());
        await flush();

        expect(modalOf(container)?.dataset.open).toBe('true');

        await act(async () => modalOf(container)?.click());

        expect(modalOf(container)?.dataset.open).toBe('false');
    });

    it('preloads a closed modal for moderators only', async () => {
        const denied = await render(ContentTypeEnum.ANIME);

        await act(async () => denied.current().preload());
        await flush();

        expect(modalOf(denied.container)).toBeNull();

        session.moderator = true;
        const allowed = await render(ContentTypeEnum.ANIME);

        await act(async () => allowed.current().preload());
        await flush();

        expect(modalOf(allowed.container)?.dataset.open).toBe('false');
    });
});
