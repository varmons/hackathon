import Link from "next/link";
import {notFound} from "next/navigation";
import {ideaRepository} from "@/domain/ideas/ideaRepository";
import {AppLocale, normalizeLocale} from "@/i18n";
import {formatDate} from "@/utils/format";
import {getTranslations} from "next-intl/server";
import {EngagementBar} from "@/components/EngagementBar";

export default async function IdeaDetailPage({params}: { params: Promise<{ locale: string; id: string }> }) {
    const {locale, id} = await params;
    const normalizedLocale = normalizeLocale(locale) as AppLocale;
    const t = await getTranslations("idea.detail");

    const idea = await ideaRepository.findByIdAndIncrementView(id);
    if (!idea) {
        notFound();
    }

    const tags = Array.isArray(idea.tags) ? (idea.tags as string[]) : [];
    const images = Array.isArray(idea.images) ? (idea.images as string[]) : [];

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12 space-y-6">
            <Link
                href={`/${normalizedLocale}/ideas`}
                className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
                &larr; {t("back")}
            </Link>

            <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1 space-y-4">
                    <div className="rounded-2xl bg-white p-6 dark:bg-gray-950">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{idea.title}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>{idea.authorName || t("anonymous")}</span>
                            <span>·</span>
                            <span>{formatDate(idea.createdAt, normalizedLocale)}</span>
                        </div>
                        <div className="mt-4">
                            <EngagementBar
                                entity="idea"
                                id={idea.id}
                                initialViews={idea.views ?? 0}
                                initialLikes={idea.likes ?? 0}
                                labels={{views: t("views"), likes: t("likes")}}
                            />
                        </div>

                        <div className="mt-4 prose max-w-none text-gray-800 dark:prose-invert dark:text-gray-100">
                            <p className="whitespace-pre-wrap">{idea.description || idea.summary}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="rounded-2xl bg-white p-6 dark:bg-gray-950">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("images")}</h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {images.map((img, idx) => (
                                    <img
                                        key={`${img}-${idx}`}
                                        src={img}
                                        alt={idea.title}
                                        className="h-32 w-full rounded-lg object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                        {t("contributions.empty")}
                    </div>
                </div>

                <aside className="w-full max-w-sm space-y-4 lg:w-80">
                    <div className="rounded-2xl bg-white p-4 dark:bg-gray-950">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{t("creator")}</div>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                            <div className="text-sm text-gray-700 dark:text-gray-200">{idea.authorName || t("anonymous")}</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}