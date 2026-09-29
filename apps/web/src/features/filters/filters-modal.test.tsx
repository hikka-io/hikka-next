import { act, type ReactElement, type ReactNode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
    ResponsiveModalTrigger,
} from '@/components/ui/responsive-modal';

import ClearFiltersFooter from './clear-filters-footer';
import FiltersModal from './filters-modal';

vi.mock('@/services/hooks/use-back-close', () => ({ useBackClose: () => {} }));

const Body = ({ className }: { className?: string }) => (
    <div className={className}>body</div>
);

const LegacyFiltersModal = ({ children }: { children?: ReactElement }) => {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveModal
            type="sheet"
            mobile="page"
            open={open}
            onOpenChange={setOpen}
        >
            <ResponsiveModalTrigger
                render={
                    children || (
                        <Button variant="outline" size="sm">
                            <AntDesignFilterFilled />
                            Фільтри
                        </Button>
                    )
                }
            />
            <ResponsiveModalContent className="md:max-w-xl" title="Фільтри">
                <Body className="-m-4 flex-1 overflow-y-auto p-4" />
                <ResponsiveModalFooter>
                    <ClearFiltersFooter
                        className="w-full"
                        onDone={() => setOpen(false)}
                    />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

type ControlledProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    body: ReactNode;
    footer: ReactNode;
};

const LegacyControlledFiltersModal = ({
    open,
    onOpenChange,
    body,
    footer,
}: ControlledProps) => (
    <ResponsiveModal
        type="sheet"
        mobile="page"
        open={open}
        onOpenChange={onOpenChange}
    >
        <ResponsiveModalContent className="md:max-w-xl" title="Фільтри">
            {body}
            <ResponsiveModalFooter>{footer}</ResponsiveModalFooter>
        </ResponsiveModalContent>
    </ResponsiveModal>
);

const trigger = (
    <Button size="md" variant="outline" className="flex lg:hidden">
        <AntDesignFilterFilled /> Фільтри
    </Button>
);

const controlled = (open: boolean) => ({
    open,
    onOpenChange: () => {},
    body: <Body className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4" />,
    footer: <div>footer</div>,
});

const mountedMarkup = async (element: ReactElement) => {
    const root = createRoot(
        document.body.appendChild(document.createElement('div')),
    );

    await act(async () => root.render(element));
    const markup = document.body.innerHTML.replace(/_r_[0-9a-z]+_/g, 'ID');
    await act(async () => root.unmount());
    document.body.innerHTML = '';

    return markup;
};

describe('FiltersModal', () => {
    it('renders the same closed markup as the legacy shell', () => {
        const markup = renderToStaticMarkup(
            <FiltersModal
                body={<Body className="-m-4 flex-1 overflow-y-auto p-4" />}
            >
                {trigger}
            </FiltersModal>,
        );

        expect(markup).toContain('Фільтри');
        expect(markup).toBe(
            renderToStaticMarkup(
                <LegacyFiltersModal>{trigger}</LegacyFiltersModal>,
            ),
        );
    });

    it('renders no trigger and no content when controlled and closed', () => {
        const markup = renderToStaticMarkup(
            <FiltersModal {...controlled(false)} />,
        );

        expect(markup).not.toContain('Фільтри');
        expect(markup).toBe(
            renderToStaticMarkup(
                <LegacyControlledFiltersModal {...controlled(false)} />,
            ),
        );
    });

    it.each([
        ['mobile page sheet', false],
        ['desktop sheet', true],
    ])('mounts the same open %s as the legacy controlled shell', async (_, desktop) => {
        vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
        vi.stubGlobal('matchMedia', () => ({
            matches: desktop,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));

        const markup = await mountedMarkup(
            <FiltersModal {...controlled(true)} />,
        );

        expect(markup).toContain('role="dialog"');
        expect(markup).toContain('footer');
        expect(markup).toBe(
            await mountedMarkup(
                <LegacyControlledFiltersModal {...controlled(true)} />,
            ),
        );
    });
});
