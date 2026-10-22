import type { FC } from 'react';

import PreviewButton from '@/components/preview-button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';

import { useArticleContext } from '../article-provider';
import { type ArticleSave, selectPreviewUrl } from '../use-article-save';
import ArticleVolume from './article-volume';
import CategoryPicker from './category-picker';
import PublishActions from './publish-actions';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    save: ArticleSave;
};

const PublishDrawer: FC<Props> = ({ open, onOpenChange, save }) => {
    const previewUrl = useArticleContext(selectPreviewUrl);

    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange}>
            <ResponsiveModalContent title="Публікація">
                <div className="flex flex-col gap-6 overflow-y-auto">
                    <CategoryPicker />
                    <ArticleVolume />
                </div>
                <ResponsiveModalFooter className="flex-row">
                    <PreviewButton to={previewUrl} size="icon-md" />
                    <PublishActions save={save} />
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default PublishDrawer;
