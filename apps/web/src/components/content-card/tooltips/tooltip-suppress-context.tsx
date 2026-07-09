import { createContext, useContext } from 'react';

const TooltipSuppressContext = createContext(false);

export const TooltipSuppressProvider = TooltipSuppressContext.Provider;

export const useTooltipSuppressed = () => useContext(TooltipSuppressContext);
