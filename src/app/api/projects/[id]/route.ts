import {projectRepository} from '@/domain/projects/projectRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

const updateSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    content: z.string().optional(),
    repositoryUrl: z
        .string()
        .url()
        .optional()
        .or(z.literal(''))
        .transform((value) => value || undefined),
    demoUrl: z
        .string()
        .url()
        .optional()
        .or(z.literal(''))
        .transform((value) => value || undefined),
    categoryId: z.string().optional(),
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
    published: z.boolean().optional(),
});

export async function GET(_: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const project = await projectRepository.findById(id);

        if (!project) {
            return NextResponse.json(errorResponse('PROJECT.NOT_FOUND'), {status: 404});
        }

        return NextResponse.json(successResponse(project));
    } catch (error) {
        console.error('[API] Failed to fetch project', error);
        return NextResponse.json(errorResponse('PROJECT.LIST_FAILED'), {status: 500});
    }
}

export async function PUT(request: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const body = await request.json();
        const validated = updateSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                errorResponse('COMMON.VALIDATION_ERROR', 'Invalid payload', validated.error.flatten()),
                {status: 400},
            );
        }

        const project = await projectRepository.update(id, {
            ...validated.data,
            galleryUrls: validated.data.images,
            attachments: validated.data.attachments,
            eventId: validated.data.eventId,
        });

        return NextResponse.json(successResponse(project));
    } catch (error) {
        console.error('[API] Failed to update project', error);
        return NextResponse.json(errorResponse('PROJECT.UPDATE_FAILED'), {status: 400});
    }
}

export async function DELETE(_: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        await projectRepository.delete(id);

        return NextResponse.json(successResponse({}));
    } catch (error) {
        console.error('[API] Failed to delete project', error);
        return NextResponse.json(errorResponse('PROJECT.DELETE_FAILED'), {status: 500});
    }
}
