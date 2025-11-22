'use client';

import {useRef, useState} from 'react';
import {Paperclip} from 'lucide-react';
import {useTranslations} from 'next-intl';

export type AttachmentPayload = {
    name: string;
    type: string;
    size: number;
    content: string;
};

type AttachmentUploaderProps = {
    onChange?: (attachments: AttachmentPayload[]) => void;
};

const MAX_SIZE_MB = 10;
const MAX_FILES = 10;

export function AttachmentUploader({onChange}: AttachmentUploaderProps) {
    const t = useTranslations('form.project.attachments');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [items, setItems] = useState<AttachmentPayload[]>([]);
    const [error, setError] = useState('');

    const handleFiles = (list: FileList | null) => {
        if (!list) return;
        const files = Array.from(list).slice(0, MAX_FILES - items.length);
        files.forEach((file) => {
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(t('tooLarge', {size: MAX_SIZE_MB}));
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    const next = [
                        ...items,
                        {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            content: result,
                        },
                    ].slice(0, MAX_FILES);
                    setItems(next);
                    onChange?.(next);
                    setError('');
                }
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="space-y-3">
            <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('helper')}</p>
            </div>

            <div
                className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                }}
            >
                <Paperclip className="mb-2 h-6 w-6" />
                <div>{t('cta')}</div>
                <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t('limit')}</div>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            {items.length > 0 && (
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    {items.map((file, idx) => (
                        <li key={`${file.name}-${idx}`} className="flex items-center gap-2">
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">({Math.ceil(file.size / 1024)} KB)</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
