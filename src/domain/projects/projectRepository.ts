import {prisma} from '@/lib/prisma';

const slugify = (value: string) => {
    const base = value.toLowerCase().trim();
    const asciiSlug = base.replace(/[^\\p{L}\\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
    if (asciiSlug) return asciiSlug;
    // Fallback for strings that would otherwise strip to empty (e.g., only symbols)
    return `tag-${Math.random().toString(36).slice(2, 8)}`;
};

type ProjectQueryParams = {
    category?: string;
    search?: string;
};

const buildSearchFilter = (params: ProjectQueryParams) => {
    const where: {
        published: boolean;
        category?: { slug: string };
        OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>;
    } = {published: true};

    if (params.category) {
        where.category = {slug: params.category};
    }

    if (params.search) {
        where.OR = [
            {title: {contains: params.search, mode: 'insensitive'}},
            {description: {contains: params.search, mode: 'insensitive'}},
        ];
    }
    return where;
};

export const projectRepository = {
    async list(params: ProjectQueryParams) {
        return prisma.project.findMany({
            where: buildSearchFilter(params),
            include: {
                author: {select: {name: true, image: true}},
                category: true,
                tags: true,
            },
            orderBy: {createdAt: 'desc'},
        });
    },

    async findById(id: string) {
        return prisma.project.findUnique({
            where: {id},
            include: {
                author: {select: {name: true, image: true}},
                category: true,
                tags: true,
            },
        });
    },

    async findByIdAndIncrementView(id: string) {
        return prisma.project.update({
            where: {id},
            data: {views: {increment: 1}},
            include: {
                author: {select: {name: true, image: true}},
                category: true,
                tags: true,
            },
        });
    },

    async create(data: {
        title: string;
        description: string;
        content?: string;
        repositoryUrl?: string;
        demoUrl?: string;
        categoryId?: string;
        authorId: string;
        tags?: string[];
        images?: string[];
        attachments?: unknown;
        eventId?: string;
    }) {
        const {tags, attachments, images, ...rest} = data;
        const normalizedTags = tags?.map((tag) => tag.trim()).filter(Boolean);
        const gallery = images ?? [];
        const galleryData: Record<string, unknown> = gallery.length ? {galleryUrls: gallery} : {};
        const attachmentsData: Record<string, unknown> = attachments ? {attachments} : {};

        const tagConnectOrCreate =
            normalizedTags && normalizedTags.length > 0
                ? Array.from(
                      normalizedTags.reduce((map, tagName) => {
                          const slug = slugify(tagName);
                          if (!map.has(slug)) {
                              map.set(slug, {where: {slug}, create: {name: tagName, slug}});
                          }
                          return map;
                      }, new Map<string, {where: {slug: string}; create: {name: string; slug: string}}>()),
                  ).map(([, value]) => value)
                : undefined;

        return prisma.project.create({
            data: {
                ...rest,
                published: true,
                thumbnail: gallery[0],
                ...(galleryData as Record<string, never>),
                ...(attachmentsData as Record<string, never>),
                tags: tagConnectOrCreate ? {connectOrCreate: tagConnectOrCreate} : undefined,
            },
        });
    },

    async incrementViews(id: string) {
        return prisma.project.update({
            where: {id},
            data: {
                views: {increment: 1},
            },
        });
    },

    async incrementLikes(id: string) {
        return prisma.project.update({
            where: {id},
            data: {
                likes: {increment: 1},
            },
        });
    },

    async update(
        id: string,
        data: {
            title?: string;
            description?: string;
            content?: string | null;
            repositoryUrl?: string | null;
            demoUrl?: string | null;
            thumbnail?: string | null;
            galleryUrls?: string[] | null;
            attachments?: unknown;
            published?: boolean;
            categoryId?: string | null;
            eventId?: string | null;
        },
    ) {
        const updateData: Record<string, unknown> = {...data};
        if (data.galleryUrls && Array.isArray(data.galleryUrls) && data.galleryUrls.length > 0) {
            updateData.thumbnail = data.galleryUrls[0];
        }
        return prisma.project.update({
            where: {id},
            data: updateData,
        });
    },

    async delete(id: string) {
        return prisma.project.delete({
            where: {id},
        });
    },
};
