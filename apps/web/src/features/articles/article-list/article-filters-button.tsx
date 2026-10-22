import type { FC } from 'react';

import {
    FiltersButton,
    FiltersModal,
    HeaderFiltersButton,
    type RenderFiltersModal,
} from '@/features/filters';

import { ArticleFiltersBody } from './article-filters';
import { ARTICLE_FILTERS_PRESERVE } from './constants';

type Props = {
    /** The ghost variant for the mobile page header. */
    inHeader?: boolean;
    className?: string;
};

const renderModal: RenderFiltersModal = (props) => (
    <FiltersModal
        {...props}
        body={
            <ArticleFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />
        }
    />
);

const ArticleFiltersButton: FC<Props> = ({ inHeader, className }) =>
    inHeader ? (
        <HeaderFiltersButton
            renderModal={renderModal}
            preserve={ARTICLE_FILTERS_PRESERVE}
        />
    ) : (
        <FiltersButton
            className={className}
            renderModal={renderModal}
            preserve={ARTICLE_FILTERS_PRESERVE}
        />
    );

export default ArticleFiltersButton;
