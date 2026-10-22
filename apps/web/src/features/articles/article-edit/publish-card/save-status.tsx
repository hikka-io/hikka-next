import type { FC } from 'react';

import SaveIndicator from '@/components/save-indicator';

import { useArticleContext } from '../article-provider';
import { describeSave } from './save-status-label';

const SaveStatus: FC = () => {
    const save = useArticleContext((state) => state.save);
    const draft = useArticleContext((state) => state.draft);
    const slug = useArticleContext((state) => state.slug);
    const { tone, label } = describeSave({ save, draft, slug });

    return <SaveIndicator tone={tone} label={label} error={save.error} />;
};

export default SaveStatus;
