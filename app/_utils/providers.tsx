'use client';

import { uk } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import { SnackbarProvider } from 'notistack';
import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import SnackbarItem from '@/app/_components/snackbar-item';
import { TooltipProvider } from '@/app/_components/ui/tooltip';
import AuthProvider from '@/app/_utils/providers/auth-provider';
import ModalProvider from '@/app/_utils/providers/modal-provider';
import SettingsProvider from '@/app/_utils/providers/settings-provider';
import ThemeProvider from '@/app/_utils/providers/theme-provider';
import { SnackbarUtilsConfigurator } from '@/app/_utils/snackbar-utils';

interface Props extends PropsWithChildren {}

function Providers({ children }: Props) {
    setDefaultOptions({ locale: uk });
    const [client] = React.useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    gcTime: Infinity,
                    retry: false,
                },
            },
        }),
    );

    return (
        <SettingsProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <QueryClientProvider client={client}>
                    <SnackbarProvider
                        Components={{
                            default: SnackbarItem,
                            success: SnackbarItem,
                            error: SnackbarItem,
                            warning: SnackbarItem,
                            info: SnackbarItem,
                        }}
                        maxSnack={2}
                        preventDuplicate
                        autoHideDuration={3000}
                        anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'bottom',
                        }}
                    >
                        <SnackbarUtilsConfigurator />
                        <AuthProvider>
                            <TooltipProvider>
                                <ModalProvider>
                                    {children}
                                    <ReactQueryDevtools initialIsOpen={false} />
                                </ModalProvider>
                            </TooltipProvider>
                        </AuthProvider>
                    </SnackbarProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </SettingsProvider>
    );
}

export default Providers;