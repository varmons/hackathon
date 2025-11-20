import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/ProjectForm';
import { getTranslations } from 'next-intl/server';

export default async function SubmitPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations('ProjectForm');

    // Fetch categories for the form
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });

    // Fetch demo user for now
    const user = await prisma.user.findUnique({
        where: { email: 'demo@example.com' },
    });

    if (!user) {
        return <div>Error: Demo user not found. Please run seed.</div>;
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <div className="mb-8 text-center">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {t('title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {t('subtitle')}
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 md:p-8">
                <ProjectForm locale={locale} authorId={user.id} categories={categories} />
            </div>
        </div>
    );
}
