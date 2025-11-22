import ProjectForm from '@/components/ProjectForm';
import {categoryRepository} from '@/domain/categories/categoryRepository';
import {AppLocale} from '@/i18n';
import {userRepository} from '@/domain/users/userRepository';
import {getTranslations} from 'next-intl/server';

export default async function SubmitPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    const normalizedLocale = locale as AppLocale;
    const tPage = await getTranslations('page.submit');
    const categories = await categoryRepository.list().catch(() => null);
    const user = await userRepository.findByEmail('demo@example.com');

    if (!user) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-12 text-center text-sm text-red-600 dark:text-red-400">
                {tPage('missingAuthor')}
            </div>
        );
    }

    if (!categories) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-12 text-center text-sm text-red-600 dark:text-red-400">
                {tPage('loadCategoriesError')}
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="mb-8 text-center md:text-left">
                <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">{tPage('title')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{tPage('subtitle')}</p>
            </div>

            <div className="rounded-2xl bg-white p-6 backdrop-blur-md dark:bg-gray-950 md:p-10">
                <ProjectForm locale={normalizedLocale} authorId={user.id} categories={categories} />
            </div>
        </div>
    );
}
