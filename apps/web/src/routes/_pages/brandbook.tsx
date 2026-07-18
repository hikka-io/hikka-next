import { createFileRoute } from '@tanstack/react-router';

import { Brandbook } from '@/features/brandbook';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/brandbook')({
    head: () =>
        generateHeadMeta({
            title: 'Брендбук',
            description:
                'Логотипи, кольори, шрифти та інші ресурси бренду Hikka',
            url: 'https://hikka.io/brandbook',
        }),
    component: Brandbook,
});
