import { permanentRedirect } from 'next/navigation';

const SettingsPage = async () => {
    return permanentRedirect('settings/profile');
};

export default SettingsPage;
