import { describe, expect, it } from 'vitest';

import { settingsHead } from './settings-head';

describe('settingsHead', () => {
    it('defaults the section to Налаштування', () => {
        expect(settingsHead('Профіль')).toEqual({
            meta: [{ title: 'Профіль / Налаштування / Hikka' }],
        });
        expect(settingsHead('Імпорт списку')).toEqual({
            meta: [{ title: 'Імпорт списку / Налаштування / Hikka' }],
        });
    });

    it('uses the given section', () => {
        expect(settingsHead('Загальне', 'Кастомізація')).toEqual({
            meta: [{ title: 'Загальне / Кастомізація / Hikka' }],
        });
    });
});
