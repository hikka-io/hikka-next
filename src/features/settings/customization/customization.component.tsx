'use client';

import { useTheme } from 'next-themes';
import MaterialSymbolsСomputerOutlineRounded from '~icons/material-symbols/computer-outline-rounded';
import MaterialSymbolsNightlightOutlineRounded from '~icons/material-symbols/nightlight-outline-rounded';
import MaterialSymbolsSunnyOutlineRounded from '~icons/material-symbols/sunny-outline-rounded';

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

import { useSettingsContext } from '@/services/providers/settings-provider';

const Component = () => {
    const {
        titleLanguage,
        snowflakes,
        setState: setSettingsState,
    } = useSettingsContext();
    const { setTheme, theme } = useTheme();

    const handleChangeTitleLanguage = (value: string[]) =>
        setSettingsState!((prev) =>
            prev
                ? {
                      ...prev,
                      titleLanguage: value[0] as
                          | 'title_ua'
                          | 'title_en'
                          | 'title_ja',
                  }
                : prev,
        );

    const handleChangeSnowflakes = (value: boolean) => {
        setSettingsState!((prev) => ({
            ...prev,
            snowflakes: value,
        }));
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
                                        <MaterialSymbolsСomputerOutlineRounded className="text-[1.2rem]" />
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
                    value={[titleLanguage!]}
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
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="flex flex-col">
                    <Label>Сніжинки ❄️</Label>
                    <Small className="text-muted-foreground">
                        Включити анімацію сніжинок на сайті
                    </Small>
                </div>
                <Switch
                    checked={snowflakes}
                    onCheckedChange={handleChangeSnowflakes}
                />
            </div>
        </div>
    );
};

export default Component;
