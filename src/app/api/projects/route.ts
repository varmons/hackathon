import {projectRepository} from '@/domain/projects/projectRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

const projectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
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
    authorId: z.string(),
    categoryId: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((value) => (value ? value : undefined)),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).max(9).optional(),
    eventId: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((value) => (value ? value : undefined)),
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
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    try {
        const projects = await projectRepository.list({category, search});
        return NextResponse.json(successResponse(projects));
    } catch (error) {
        console.error('[API] Failed to fetch projects', error);
        return NextResponse.json(errorResponse('PROJECT.LIST_FAILED'), {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = projectSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                errorResponse('COMMON.VALIDATION_ERROR', 'Invalid payload', validated.error.flatten()),
                {status: 400},
            );
        }

        const {images, ...rest} = validated.data;
        const project = await projectRepository.create({
            ...rest,
            images,
        });

        return NextResponse.json(successResponse(project), {status: 201});
    } catch (error) {
        console.error('[API] Failed to create project', error);
        return NextResponse.json(errorResponse('PROJECT.CREATE_FAILED'), {status: 400});
    }
}
