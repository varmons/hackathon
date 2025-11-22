'use client';

import {useState} from 'react';
import {Eye, ThumbsUp} from 'lucide-react';

type Entity = 'project' | 'idea' | 'event';

type Props = {
    entity: Entity;
    id: string;
    initialViews: number;
    initialLikes: number;
    labels: {views: string; likes: string};
};

export function EngagementBar({entity, id, initialViews, initialLikes, labels}: Props) {
    const [views] = useState(initialViews);
    const [likes, setLikes] = useState(initialLikes);
    const [liking, setLiking] = useState(false);

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);
        setLikes((l) => l + 1);
        try {
            const res = await fetch(`/api/${entity}/${id}/like`, {method: 'POST'});
            const data = await res.json();
            if (data?.data?.likes !== undefined) {
                setLikes(data.data.likes);
            }
        } catch (error) {
            setLikes((l) => Math.max(l - 1, 0));
            console.error(`Failed to like ${entity}`, error);
        } finally {
            setLiking(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <Eye className="h-4 w-4" />
                <span>{views}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{labels.views}</span>
            </div>
            <button
                type="button"
                onClick={handleLike}
                disabled={liking}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
            >
                <ThumbsUp className="h-4 w-4" />
                <span>{likes}</span>
                <span className="text-xs text-blue-100">{labels.likes}</span>
            </button>
        </div>
    );
}
