import {IdeaFormWizard} from '@/components/IdeaFormWizard';
import {AppLocale, normalizeLocale} from '@/i18n';
import {getTranslations} from 'next-intl/server';

export default async function NewIdeaPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    const normalizedLocale = normalizeLocale(locale) as AppLocale;
    const t = await getTranslations('idea.create');

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="rounded-2xl bg-white p-6 dark:bg-gray-950 md:p-10">
                <IdeaFormWizard locale={normalizedLocale} />
            </div>
        </div>
    );
}
