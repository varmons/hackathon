import {ideaRepository} from '@/domain/ideas/ideaRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(_: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const idea = await ideaRepository.findByIdAndIncrementView(id);
        return NextResponse.json(successResponse({views: idea.views}));
    } catch (error) {
        console.error('[API] Failed to add view to idea', error);
        return NextResponse.json(errorResponse('IDEA.CREATE_FAILED'), {status: 400});
    }
}
