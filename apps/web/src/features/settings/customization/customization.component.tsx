'use client';

import { useTheme } from 'next-themes';

import MaterialSymbolsComputerOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsComputerOutlineRounded';
import MaterialSymbolsNightlightOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsNightlightOutlineRounded';
import MaterialSymbolsSunnyOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSunnyOutlineRounded';
import Small from '@/components/typography/small';
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

import { useSettingsStore } from '@/services/stores/settings-store';

const Component = () => {
    const settings = useSettingsStore();

    const { setTheme, theme } = useTheme();

    const handleChangeTitleLanguage = (value: string[]) =>
        settings.setTitleLanguage(
            value[0] as 'title_ua' | 'title_en' | 'title_ja',
        );

    const handleChangeNameLanguage = (value: string[]) =>
        settings.setNameLanguage(
            value[0] as 'name_ua' | 'name_en' | 'name_native',
        );

    const handleChangeSnowflakes = (value: boolean) => {
        settings.setSnowflakes(value);
    };

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Тема сайту</Label>
                <Select
                    value={[theme!]}
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
                    value={[settings.titleLanguage!]}
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
                <Label>Мова імен</Label>

                <Select
                    value={[settings.nameLanguage!]}
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
                <div className="flex flex-col">
                    <Label>Сніжинки ❄️</Label>
                    <Small className="text-muted-foreground">
                        Включити анімацію сніжинок на сайті
                    </Small>
                </div>
                <Switch
                    checked={settings.snowflakes}
                    onCheckedChange={handleChangeSnowflakes}
                />
            </div>
        </div>
    );
};

export default Component;
