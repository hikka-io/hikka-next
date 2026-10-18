import type { FC } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';

import type { ArticleSave } from '../use-article-save';
import ArticleVolume from './article-volume';
import CategoryPicker from './category-picker';
import PreviewButton from './preview-button';
import PublishActions from './publish-actions';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    save: ArticleSave;
};

const PublishDrawer: FC<Props> = ({ open, onOpenChange, save }) => (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
        <ResponsiveModalContent title="Публікація">
            <div className="flex flex-col gap-6 overflow-y-auto">
                <CategoryPicker />
                <ArticleVolume />
            </div>
            <ResponsiveModalFooter className="flex-row">
                <PreviewButton size="icon-md" />
                <PublishActions save={save} />
            </ResponsiveModalFooter>
        </ResponsiveModalContent>
    </ResponsiveModal>
);

export default PublishDrawer;
