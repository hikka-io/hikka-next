import type { FC } from 'react';

import type { CollectionContentTypeEnum } from '@hikka/api';

import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useSession } from '@/services/session';

import AnimatedHeight from './animated-height';
import CollectionPicker from './collection-picker';
import { COLLECTION_PICKER_TITLE as TITLE } from './constants';

type Props = {
    content_type: CollectionContentTypeEnum;
    slug: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const AddToCollectionDrawer: FC<Props> = ({
    content_type,
    slug,
    open,
    onOpenChange,
}) => {
    const { user } = useSession();

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent
                aria-label={TITLE}
                className="max-h-[85dvh] overflow-hidden p-0 pb-[var(--safe-area-bottom)]"
            >
                <AnimatedHeight className="p-4">
                    {user && (
                        <CollectionPicker
                            content_type={content_type}
                            slug={slug}
                        />
                    )}
                </AnimatedHeight>
            </DrawerContent>
        </Drawer>
    );
};

export default AddToCollectionDrawer;
