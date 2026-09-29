import { type ReactElement, useState } from 'react';
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

const trigger = (
    <Button size="md" variant="outline" className="flex lg:hidden">
        <AntDesignFilterFilled /> Фільтри
    </Button>
);

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
});
