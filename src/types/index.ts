import { Prisma } from '@prisma/client';

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
    include: {
        author: { select: { name: true; image: true } };
        category: true;
        tags: true;
    };
}>;
