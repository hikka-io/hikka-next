import type { SaveTone } from '@/components/save-indicator';

import type { ArticleStore } from '../article-store';

type Source = Pick<ArticleStore, 'save' | 'draft' | 'slug'>;

export function describeSave({ save, draft, slug }: Source): {
    tone: SaveTone;
    label: string;
} {
    if (save.status === 'saving') return { tone: 'saving', label: 'Зберігаю…' };
    if (save.status === 'error') {
        return { tone: 'error', label: 'Не вдалося зберегти' };
    }
    if (save.dirty) return { tone: 'unsaved', label: 'Незбережені зміни' };
    if (!draft) return { tone: 'published', label: 'Опубліковано' };

    return slug
        ? { tone: 'saved', label: 'Чернетку збережено' }
        : { tone: 'draft', label: 'Нова чернетка' };
}
