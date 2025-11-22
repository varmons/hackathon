import {useTranslations} from 'next-intl';

export default function Footer() {
    const t = useTranslations('component.footer');
    return (
        <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-950">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>{t('copyright', {year: new Date().getFullYear()})}</p>
            </div>
        </footer>
    );
}
