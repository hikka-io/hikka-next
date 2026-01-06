'use client';

import { useTheme } from 'next-themes';

import MaterialSymbolsComputerOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsComputerOutlineRounded';
import MaterialSymbolsNightlightOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsNightlightOutlineRounded';
import MaterialSymbolsSunnyOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSunnyOutlineRounded';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useUIStore } from '@/services/providers/ui-store-provider';
import { useSettingsStore, type SecondaryTitleLang } from '@/services/stores/settings-store';

const PreferencesSettings = () => {
    const UI = useUIStore((state) => state);
    const setTitleLanguage = useUIStore((state) => state.setTitleLanguage);
    const setNameLanguage = useUIStore((state) => state.setNameLanguage);
    const setOverlay = useUIStore((state) => state.setOverlay);

    const secondaryTitleLanguage = useSettingsStore((state) => state.secondaryTitleLanguage);
    const setSecondaryTitleLanguage = useSettingsStore((state) => state.setSecondaryTitleLanguage);

    const { setTheme, theme } = useTheme();

    const handleChangeTitleLanguage = (value: string[]) =>
        setTitleLanguage(value[0] as 'title_ua' | 'title_en' | 'title_ja');

    const handleChangeNameLanguage = (value: string[]) =>
        setNameLanguage(value[0] as 'name_ua' | 'name_en' | 'name_native');

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Тема сайту</Label>
                <Select
                    value={[theme ?? 'dark']}
                    onValueChange={(value) => setTheme(value[0])}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Виберіть тему..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <MaterialSymbolsNightlightOutlineRounded className="text-[1.2rem]" />
                                        Темна тема
                                    </div>
                                </SelectItem>
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <MaterialSymbolsSunnyOutlineRounded className="text-[1.2rem]" />
                                        Світла тема
                                    </div>
                                </SelectItem>
                                <SelectItem value="system">
                                    <div className="flex items-center gap-2">
                                        <MaterialSymbolsComputerOutlineRounded className="text-[1.2rem]" />
                                        Системна тема
                                    </div>
                                </SelectItem>
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-full flex-col gap-2">
                <Label>Мова назв контенту</Label>

                <Select
                    value={[UI.preferences?.title_language ?? 'title_ua']}
                    onValueChange={handleChangeTitleLanguage}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Виберіть мову..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                <SelectItem value="title_ua">
                                    Українська
                                </SelectItem>
                                <SelectItem value="title_en">
                                    Англійська
                                </SelectItem>
                                <SelectItem value="title_ja">Рідна</SelectItem>
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Другорядна назва</Label>
                <Select
                    value={[secondaryTitleLanguage]}
                    onValueChange={(v) => setSecondaryTitleLanguage(v[0] as SecondaryTitleLang)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Виберіть мову..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                <SelectItem value="en">Англійська</SelectItem>
                                <SelectItem value="ja">Японська</SelectItem>
                                <SelectItem value="none">Не показувати</SelectItem>
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Мова імен</Label>

                <Select
                    value={[UI.preferences?.name_language ?? 'name_ua']}
                    onValueChange={handleChangeNameLanguage}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Виберіть мову..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                <SelectItem value="name_ua">
                                    Українська
                                </SelectItem>
                                <SelectItem value="name_en">
                                    Англійська
                                </SelectItem>
                                <SelectItem value="name_native">
                                    Рідна
                                </SelectItem>
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <Label>Накладання градієнту</Label>
                    <span className="text-xs text-muted-foreground">
                        Накладати градієнт на обкладинку
                    </span>
                </div>

                <Switch
                    checked={UI.preferences?.overlay ?? true}
                    onCheckedChange={(value) => setOverlay(value)}
                />
            </div>
        </div>
    );
};

export default PreferencesSettings;
