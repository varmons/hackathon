'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Loader2} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {z} from 'zod';
import {httpClient} from '@/lib/httpClient';
import {AppLocale} from '@/i18n';
import {eventService} from '@/services/events';
import {resolveErrorMessageKey} from '@/utils/errorCodes';
import {ProjectWithRelations} from '@/types';
import {MarkdownEditor} from './MarkdownEditor';
import {ImageUploader} from './ImageUploader';
import {TagSelector} from './TagSelector';
import {AttachmentUploader, AttachmentPayload} from './AttachmentUploader';

type ProjectFormProps = {
    locale: AppLocale;
    authorId: string;
    categories: {id: string; name: string}[];
};

const projectFormSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    content: z.string().optional(),
    repositoryUrl: z
        .string()
        .url()
        .optional()
        .or(z.literal(''))
        .transform((value) => (value ? value : undefined)),
    demoUrl: z
        .string()
        .url()
        .optional()
        .or(z.literal(''))
        .transform((value) => (value ? value : undefined)),
    categoryId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).max(9).optional(),
    attachments: z
        .array(
            z.object({
                name: z.string(),
                type: z.string(),
                size: z.number(),
                content: z.string(),
            }),
        )
        .max(10)
        .optional(),
    eventId: z.string().optional(),
    authorId: z.string(),
});

const RequiredMark = () => (
    <span className="ml-1 text-red-500" aria-hidden="true">
        *
    </span>
);

export default function ProjectForm({locale, authorId, categories}: ProjectFormProps) {
    const t = useTranslations('form.project');
    const tError = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [attachments, setAttachments] = useState<AttachmentPayload[]>([]);
    const [events, setEvents] = useState<Array<{id: string; title: string}>>([]);
    const router = useRouter();

    const parseFormData = (formData: FormData) => {
        const tagsRaw = (formData.get('tags') as string | null) ?? '';
        const payload = {
            title: (formData.get('title') as string | null)?.trim() ?? '',
            description: (formData.get('description') as string | null)?.trim() ?? '',
            content: (formData.get('content') as string | null)?.trim() || undefined,
            repositoryUrl: (formData.get('repositoryUrl') as string | null)?.trim() ?? undefined,
            demoUrl: (formData.get('demoUrl') as string | null)?.trim() ?? undefined,
            categoryId: categories[0]?.id,
            tags: Array.from(
                new Set(
                    tagsRaw
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .concat(tags),
                ),
            ),
            images,
            attachments,
            eventId: (formData.get('eventId') as string | null) || undefined,
            authorId,
        };
        return projectFormSchema.safeParse(payload);
    };

    useEffect(() => {
        const loadEvents = async () => {
            const list = await eventService.list();
            setEvents(list);
        };
        loadEvents();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const validation = parseFormData(new FormData(event.currentTarget));
        if (!validation.success) {
            setIsLoading(false);
            setError(t('validationError'));
            return;
        }

        const response = await httpClient.post<ProjectWithRelations>('/api/projects', validation.data);

        if (!response.success) {
            setIsLoading(false);
            setError(tError(resolveErrorMessageKey(response.error.code)));
            return;
        }

        router.push(`/${locale}/project/${response.data.id}`);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-5 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div>
                    <label htmlFor="title" className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                        {t('title')}
                        <RequiredMark />
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{t('titleHint')}</p>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('titlePlaceholder')}
                    />
                </div>

                <TagSelector value={tags} onChange={setTags} suggestions={categories.map((c) => c.name)} />
            </div>

            <div className="space-y-2 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <label htmlFor="description" className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                    {t('description')}
                    <RequiredMark />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('descriptionHelper')}</p>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder={t('descriptionPlaceholder')}
                />
            </div>

            <div className="space-y-2 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('content')}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('descriptionHelper')}</p>
                <MarkdownEditor name="content" placeholder={t('contentPlaceholder')} />
            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <ImageUploader value={images} onChange={setImages} />
            </div>

            <div className="space-y-3 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('eventSelect.title')}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('eventSelect.helper')}</p>
                <select
                    name="eventId"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    defaultValue=""
                >
                    <option value="">{t('eventSelect.none')}</option>
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-5 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <div>
                    <label htmlFor="demoUrl" className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                        {t('demoUrl')}
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{t('demoUrlHelper')}</p>
                    <input
                        type="url"
                        id="demoUrl"
                        name="demoUrl"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('demoUrlPlaceholder')}
                    />
                </div>

                <div>
                    <label htmlFor="repositoryUrl" className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">
                        {t('repositoryUrl')}
                    </label>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{t('repositoryUrlHelper')}</p>
                    <input
                        type="url"
                        id="repositoryUrl"
                        name="repositoryUrl"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder={t('repositoryUrlPlaceholder')}
                    />
                </div>
            </div>

            <div className="space-y-5 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/60">
                <AttachmentUploader onChange={setAttachments} />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('submitting')}
                    </>
                ) : (
                    t('submit')
                )}
            </button>
        </form>
    );
}
