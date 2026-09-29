import { createContext, useContext } from 'react';

export type ImagePreset = 'card' | 'cardLg' | 'cardSm' | 'cardXs';

export const ImagePresetContext = createContext<ImagePreset | undefined>(
    undefined,
);

export function useImagePreset() {
    return useContext(ImagePresetContext);
}
