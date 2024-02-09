import { OptionsObject, ProviderContext, useSnackbar } from 'notistack';
import React from 'react';

let useSnackbarRef: ProviderContext;
export const SnackbarUtilsConfigurator: React.FC = () => {
    useSnackbarRef = useSnackbar();
    return null;
};

export default {
    success(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'success' });
    },
    warning(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'warning' });
    },
    info(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'info' });
    },
    error(msg: string, options: OptionsObject = {}) {
        this.toast(msg, { ...options, variant: 'error' });
    },
    toast(msg: string, options: OptionsObject = {}) {
        useSnackbarRef.enqueueSnackbar(msg, options);
    },
};
