import { AnsiSpan } from "@/app/_components/page/console/utils/types";

const defaultColour = 'text-white';

const ansiColorMap: { [key: string]: string } = {
    '30': 'text-black',
    '31': 'text-red-400',
    '32': 'text-green-400',
    '33': 'text-yellow-400',
    '34': 'text-blue-400',
    '35': 'text-purple-400',
    '36': 'text-cyan-400',
    '37': 'text-white',
    '39': defaultColour,
    '90': 'text-gray-500',
    '91': 'text-red-300',
    '92': 'text-green-300',
    '93': 'text-yellow-300',
    '94': 'text-blue-300',
    '95': 'text-purple-300',
    '96': 'text-cyan-300',
    '97': 'text-gray-200'
};

export function parseAnsiString(str: string): AnsiSpan[] {
    const ansiRegex = /\x1b\[([0-9;]*)m/g;
    const spans: AnsiSpan[] = [];
    let lastIndex = 0;
    let currentClasses = [defaultColour];
    let match;

    while ((match = ansiRegex.exec(str)) !== null) {
        if (match.index > lastIndex) {
            const text = str.slice(lastIndex, match.index);
            if (text) {
                spans.push({
                    text,
                    className: currentClasses.join(' ')
                });
            }
        }

        const codes = match[1].split(';').filter(Boolean);

        for (const code of codes) {
            if (code === '0') {
                currentClasses = [defaultColour];
            } else if (code === '1') {
                if (!currentClasses.includes('font-bold')) {
                    currentClasses.push('font-bold');
                }
            } else if (ansiColorMap[code]) {
                currentClasses = currentClasses.filter(cls => !cls.startsWith('text-'));
                currentClasses.push(ansiColorMap[code]);
            }
        }

        lastIndex = ansiRegex.lastIndex;
    }

    if (lastIndex < str.length) {
        const text = str.slice(lastIndex);
        if (text) {
            spans.push({
                text,
                className: currentClasses.join(' ')
            });
        }
    }

    return spans.length > 0 ? spans : [{ text: str, className: 'text-green-400' }];
}