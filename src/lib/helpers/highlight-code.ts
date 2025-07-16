import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { createHighlighterCore } from 'shiki/core';

const highlightCodeCache = new Map<string, string>();
const jsEngine = createJavaScriptRegexEngine();
const highlighterPromise = createHighlighterCore({
    themes: [import('@shikijs/themes/github-dark'), import('@shikijs/themes/github-light-default')],
    langs: [import('@shikijs/langs/log'), import('@shikijs/langs/json')],
    engine: jsEngine
});

export async function highlightCode(
    code: string,
    language: 'log' | 'json' = 'log'
): Promise<string> {
    const cachedCode = highlightCodeCache.get(code);
    if (cachedCode) return cachedCode;

    const highlighter = await highlighterPromise;

    const html = highlighter.codeToHtml(formatCode(code), {
        lang: language,
        themes: {
            dark: 'github-dark',
            light: 'github-light-default'
        },
        transformers: [
            {
                pre(node) {
                    node.properties['class'] =
                        'no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent';
                },
                code(node) {
                    node.properties['data-line-numbers'] = '1';
                },
                line(node) {
                    node.properties['data-line'] = 'text-primary';
                }
            }
        ]
    });

    highlightCodeCache.set(code, html);

    return html;
}

function formatCode(code: string): string {
    return code.replace(/\t/g, '  ');
}
