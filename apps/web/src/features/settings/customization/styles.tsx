'use client';

import { Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useModalContext } from '@/services/providers/modal-provider';
import { useUIStore } from '@/services/providers/ui-store-provider';
import { toHSLString } from '@/utils/appearance/color';
import { PREVIEW_COLOR_TOKENS } from '@/utils/constants/styles';

import CustomColorsModal from './components/custom-colors-modal';

const StylesSettings = () => {
    const { openModal } = useModalContext();
    const { resolvedTheme } = useTheme();
    const UI = useUIStore((state) => state);

    const setRadius = useUIStore((state) => state.setRadius);

    const syncUserUI = useUIStore((state) => state.syncUserUI);

    const handleRadiusChange = (value: string) => {
        setRadius(value ? `${value}rem` : undefined);
    };

    const handleOpenCustomModal = () => {
        openModal({
            content: <CustomColorsModal />,
            title: 'Налаштування кольорів',
            description: 'Персоналізуйте кольори сайту',
            forceModal: true,
            className: '!max-w-4xl',
            onClose: syncUserUI,
            preventBackdropClose: true,
        });
    };

    const currentRadius = UI.styles?.radius?.replace('rem', '') ?? '';

    const activeTheme = (resolvedTheme as 'light' | 'dark') ?? 'dark';
    const themeColors = UI.styles?.[activeTheme]?.colors;

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Палітра кольорів</Label>
                <div className="flex flex-wrap gap-2">
                    {PREVIEW_COLOR_TOKENS.map((token) => (
                        <div
                            key={token}
                            className="size-9 rounded-md border"
                            style={{
                                backgroundColor: toHSLString(
                                    themeColors?.[token],
                                ),
                            }}
                        />
                    ))}
                    <Button onClick={handleOpenCustomModal} size="md">
                        <Palette className="size-4" />
                        Налаштувати
                    </Button>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Радіус заокруглення</Label>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={currentRadius === '0' ? 'default' : 'outline'}
                        onClick={() => handleRadiusChange('0')}
                        size="badge"
                    >
                        Без заокруглення
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.25' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.25')}
                        size="badge"
                    >
                        XS
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.5' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.5')}
                        size="badge"
                    >
                        SM
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.625' || !currentRadius
                                ? 'default'
                                : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.625')}
                        size="badge"
                    >
                        MD
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.75' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.75')}
                        size="badge"
                    >
                        LG
                    </Button>
                    <Button
                        variant={
                            currentRadius === '1.5' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('1.5')}
                        size="badge"
                    >
                        XL
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StylesSettings;
