'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProjectFormProps {
    locale: string;
    authorId: string;
    categories: { id: string; name: string }[];
}

import { useTranslations } from 'next-intl';

export default function ProjectForm({ locale, authorId, categories }: ProjectFormProps) {
    const t = useTranslations('ProjectForm');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            repositoryUrl: formData.get('repositoryUrl'),
            demoUrl: formData.get('demoUrl'),
            categoryId: formData.get('categoryId'),
            tags: (formData.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean),
            authorId,
        };

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to submit project');
            }

            const project = await res.json();
            router.push(`/${locale}/project/${project.id}`);
            router.refresh();
        } catch (err) {
            setError(t('form.error'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {t('form.title')}
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder={t('form.titlePlaceholder')}
                />
            </div>

            <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {t('form.description')}
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder={t('form.descriptionPlaceholder')}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        {t('form.category')}
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    >
                        <option value="">{t('form.categoryPlaceholder')}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="tags" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        {t('form.tags')}
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder={t('form.tagsPlaceholder')}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="repositoryUrl" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        {t('form.repositoryUrl')}
                    </label>
                    <input
                        type="url"
                        id="repositoryUrl"
                        name="repositoryUrl"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder={t('form.repositoryUrlPlaceholder')}
                    />
                </div>

                <div>
                    <label htmlFor="demoUrl" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        {t('form.demoUrl')}
                    </label>
                    <input
                        type="url"
                        id="demoUrl"
                        name="demoUrl"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder={t('form.demoUrlPlaceholder')}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {t('form.content')}
                </label>
                <textarea
                    id="content"
                    name="content"
                    rows={10}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder={t('form.contentPlaceholder')}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('form.submitting')}
                    </>
                ) : (
                    t('form.submit')
                )}
            </button>
        </form>
    );
}
