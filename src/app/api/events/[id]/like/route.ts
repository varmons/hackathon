import {eventRepository} from '@/domain/events/eventRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(_: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const event = await eventRepository.incrementLikes(id);
        return NextResponse.json(successResponse({likes: event.likes}));
    } catch (error) {
        console.error('[API] Failed to like event', error);
        return NextResponse.json(errorResponse('EVENT.UPDATE_FAILED'), {status: 400});
    }
}
