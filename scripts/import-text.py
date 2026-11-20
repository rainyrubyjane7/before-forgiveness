"""Extract the manuscript's original Word paragraphs as reading sections."""
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
WORD = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
CHAPTER_NUMERALS = '一二三四五六七八九'


def paragraph_text(paragraph):
    parts = []
    for piece in paragraph.iter():
        if piece.tag == WORD + 't':
            parts.append(piece.text or '')
        elif piece.tag == WORD + 'tab':
            parts.append('\t')
        elif piece.tag in (WORD + 'br', WORD + 'cr'):
            parts.append('\n')
    return ''.join(parts)


def extract(source):
    with ZipFile(source) as archive:
        document = ET.fromstring(archive.read('word/document.xml'))
    lines = [paragraph_text(p) for p in document.iter(WORD + 'p')]
    if lines[0] != '在获得原谅之前':
        raise ValueError('未找到原稿标题。')

    markers = []
    for index, line in enumerate(lines):
        if match := re.fullmatch(r'([一二三四五六七八九]) .+', line):
            section = f'ch{CHAPTER_NUMERALS.index(match[1]) + 1:02}'
        elif line == '现在，由你来决定Dean的回答。':
            section = 'choice'
        elif line == '选择沉默。':
            section = 'silence'
        elif line == '选择亲吻。':
            section = 'kiss'
        elif line.startswith('番外 '):
            section = 'extra'
        elif line == '【打开瓶子】':
            section = 'bottle'
        else:
            continue
        markers.append((section, index))

    expected = [f'ch{i:02}' for i in range(1, 10)] + ['choice', 'silence', 'kiss', 'extra', 'bottle']
    if [section for section, _ in markers] != expected:
        raise ValueError('章节、选择、分支或番外边界与原稿结构不符。')

    sections = {}
    for (section, start), (_, stop) in zip(markers, markers[1:] + [('', len(lines))]):
        sections[section] = lines[start:stop]
    assert [lines[0]] + [line for section in sections.values() for line in section] == lines
    return {'title': lines[0], 'sections': sections}


if __name__ == '__main__':
    candidates = [ROOT / 'text.docx', *ROOT.glob('attachments/*/text.docx')]
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else next((p for p in candidates if p.is_file()), None)
    if not source:
        sys.exit('请提供原稿路径，例如 npm run import:text -- text.docx')
    data = extract(source)
    target = ROOT / 'src' / 'manuscript.json'
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'已写入 {target.relative_to(ROOT)}，逐段重组核对通过。')
