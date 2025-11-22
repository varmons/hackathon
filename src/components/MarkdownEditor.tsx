'use client';

import dynamic from 'next/dynamic';
import {useState} from 'react';
import {useTranslations} from 'next-intl';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {ssr: false});

type MarkdownEditorProps = {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
};

export function MarkdownEditor({name, label, placeholder, defaultValue = '', onChange}: MarkdownEditorProps) {
    const t = useTranslations('form.project');
    const [value, setValue] = useState(defaultValue);

    return (
        <div className="space-y-2">
            {label && (
                <div>
                    <label htmlFor={`${name}-editor`} className="text-sm font-medium text-gray-900 dark:text-white">
                        {label}
                    </label>
                </div>
            )}

            <input type="hidden" name={name} value={value} />

            <div data-color-mode="light" className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <MDEditor
                    id={`${name}-editor`}
                    value={value}
                    height={320}
                    preview="edit"
                    textareaProps={{placeholder: placeholder ?? t('contentPlaceholder')}}
                    onChange={(val) => {
                        const nextValue = val ?? '';
                        setValue(nextValue);
                        onChange?.(nextValue);
                    }}
                    commandsFilter={(command) => command}
                />
            </div>
        </div>
    );
}
