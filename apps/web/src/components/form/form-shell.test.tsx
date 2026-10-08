import { act } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';

import { expect, it, vi } from 'vitest';

import { useAppForm } from './use-app-form';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function PortalledForm({
    portal,
    onSubmit,
}: {
    portal: HTMLElement;
    onSubmit: () => void;
}) {
    const form = useAppForm({ defaultValues: { url: '' }, onSubmit });

    return createPortal(
        <form.AppForm>
            <form.Form className="contents" />
        </form.AppForm>,
        portal,
    );
}

it('submits its own form without reaching an outer form through a portal', async () => {
    const onSubmit = vi.fn();
    const onOuterSubmit = vi.fn();
    const container = document.createElement('div');
    const portal = document.createElement('div');
    document.body.append(container, portal);
    const root = createRoot(container);

    await act(async () =>
        root.render(
            <form onSubmit={onOuterSubmit}>
                <PortalledForm portal={portal} onSubmit={onSubmit} />
            </form>,
        ),
    );

    const inner = portal.querySelector('form');
    const event = new Event('submit', { bubbles: true, cancelable: true });
    await act(async () => {
        inner?.dispatchEvent(event);
    });

    expect(inner?.className).toBe('contents');
    expect(event.defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onOuterSubmit).not.toHaveBeenCalled();

    await act(async () => root.unmount());
    container.remove();
    portal.remove();
});
