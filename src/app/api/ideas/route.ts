import {ideaRepository} from '@/domain/ideas/ideaRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

const ideaSchema = z.object({
    title: z.string().min(1),
    summary: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).max(9).optional(),
    location: z.string().optional(),
    authorName: z.string().optional(),
});

export async function GET() {
    try {
        const ideas = await ideaRepository.list();
        return NextResponse.json(successResponse(ideas));
    } catch (error) {
        console.error('[API] Failed to fetch ideas', error);
        return NextResponse.json(errorResponse('IDEA.LIST_FAILED'), {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = ideaSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json(
                errorResponse('COMMON.VALIDATION_ERROR', 'Invalid payload', validated.error.flatten()),
                {status: 400},
            );
        }

        const idea = await ideaRepository.create(validated.data);
        return NextResponse.json(successResponse(idea), {status: 201});
    } catch (error) {
        console.error('[API] Failed to create idea', error);
        return NextResponse.json(errorResponse('IDEA.CREATE_FAILED'), {status: 400});
    }
}
