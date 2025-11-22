import {projectRepository} from '@/domain/projects/projectRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(_: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const project = await projectRepository.incrementViews(id);
        return NextResponse.json(successResponse({views: project.views}));
    } catch (error) {
        console.error('[API] Failed to increment views', error);
        return NextResponse.json(errorResponse('PROJECT.UPDATE_FAILED'), {status: 400});
    }
}
