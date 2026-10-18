import type { FC } from 'react';

import Card from '@/components/ui/card';
import { FooterBar } from '@/components/ui/footer-bar';
import { Header, HeaderTitle } from '@/components/ui/header';
import { cn } from '@/utils/cn';

import type { ArticleSave } from '../use-article-save';
import ArticleVolume from './article-volume';
import CategoryPicker from './category-picker';
import PreviewButton from './preview-button';
import PublishActions from './publish-actions';

type Props = {
    save: ArticleSave;
    className?: string;
};

const PublishCard: FC<Props> = ({ save, className }) => (
    <Card className={cn('gap-6', className)}>
        <Header>
            <HeaderTitle as="h2" size="subsection">
                Публікація
            </HeaderTitle>
            <div className="ml-auto">
                <PreviewButton />
            </div>
        </Header>

        <CategoryPicker />
        <ArticleVolume />

        <FooterBar className="-mx-4 -mb-4">
            <PublishActions save={save} />
        </FooterBar>
    </Card>
);

export default PublishCard;
