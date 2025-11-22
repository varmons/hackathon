import {prisma} from '@/lib/prisma';

type CreateIdeaInput = {
    title: string;
    summary?: string;
    description?: string | null;
    tags?: string[];
    images?: string[];
    location?: string | null;
    authorName?: string | null;
};

const normalizeSummary = (summary?: string, description?: string | null) => {
    if (summary && summary.trim()) return summary.trim();
    if (description && description.trim()) {
        const plain = description.replace(/[#*_>\-\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
        return plain.slice(0, 160);
    }
    return '';
};

export const ideaRepository = {
    async list() {
        return prisma.idea.findMany({
            orderBy: {createdAt: 'desc'},
        });
    },

    async findById(id: string) {
        return prisma.idea.findUnique({
            where: {id},
        });
    },

    async findByIdAndIncrementView(id: string) {
        return prisma.idea.update({
            where: {id},
            data: {views: {increment: 1}},
        });
    },

    async incrementLikes(id: string) {
        return prisma.idea.update({
            where: {id},
            data: {likes: {increment: 1}},
        });
    },

    async create(data: CreateIdeaInput) {
        const tags = (data.tags || []).map((t) => t.trim()).filter(Boolean);
        const images = (data.images || []).filter(Boolean);
        const summary = normalizeSummary(data.summary, data.description);

        return prisma.idea.create({
            data: {
                title: data.title.trim(),
                summary,
                description: data.description,
                tags,
                images,
                thumbnail: images[0],
                location: data.location || undefined,
                authorName: data.authorName || undefined,
                likes: 0,
                views: 0,
            },
        });
    },
};
