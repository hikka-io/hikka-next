import { type ReactNode, useState } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
    ResponsiveModalTrigger,
} from '@/components/ui/responsive-modal';
import ClearFiltersFooter from '@/features/filters/clear-filters-footer';

import { ArticleFiltersBody } from './article-filters';

type Props = {
    children?: ReactNode;
};

const ArticleFiltersModal = ({ children }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <ResponsiveModal
            type="sheet"
            mobile="page"
            open={open}
            onOpenChange={setOpen}
        >
            <ResponsiveModalTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm">
                        <AntDesignFilterFilled />
                        Фільтри
                    </Button>
                )}
            </ResponsiveModalTrigger>
            <ResponsiveModalContent className="md:max-w-xl" title="Фільтри">
                <ArticleFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />
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

export default ArticleFiltersModal;
