'use client';

import React, { useEffect, useRef } from 'react';
import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';

interface EditorJSComponentProps {
  initialContent: string;
  onChange: (htmlContent: string, rawData?: OutputData) => void;
  holderId?: string;
}

export function editorDataToHtml(data: OutputData): string {
  if (!data || !data.blocks || !Array.isArray(data.blocks)) return '';

  return data.blocks
    .map((block) => {
      switch (block.type) {
        case 'header': {
          const level = block.data.level || 2;
          return `<h${level}>${block.data.text || ''}</h${level}>`;
        }
        case 'paragraph': {
          return `<p>${block.data.text || ''}</p>`;
        }
        case 'list': {
          const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const items = Array.isArray(block.data.items)
            ? block.data.items.map((item: string | { content: string }) => {
                const text = typeof item === 'string' ? item : item.content || '';
                return `<li>${text}</li>`;
              }).join('')
            : '';
          return `<${tag}>${items}</${tag}>`;
        }
        case 'checklist': {
          const items = Array.isArray(block.data.items)
            ? block.data.items
                .map(
                  (item: { text: string; checked: boolean }) =>
                    `<li><input type="checkbox" ${item.checked ? 'checked' : ''} disabled /> ${item.text || ''}</li>`
                )
                .join('')
            : '';
          return `<ul class="checklist">${items}</ul>`;
        }
        case 'quote': {
          const caption = block.data.caption ? `<cite>${block.data.caption}</cite>` : '';
          return `<blockquote><p>${block.data.text || ''}</p>${caption}</blockquote>`;
        }
        case 'code': {
          return `<pre><code>${block.data.code || ''}</code></pre>`;
        }
        case 'warning': {
          const title = block.data.title ? `<strong>${block.data.title}</strong><br/>` : '';
          return `<div class="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg my-4 text-amber-200 text-xs">${title}${block.data.message || ''}</div>`;
        }
        case 'table': {
          const rows = Array.isArray(block.data.content)
            ? block.data.content
                .map(
                  (row: string[]) =>
                    `<tr>${row.map((cell: string) => `<td class="p-2 border border-slate-700">${cell}</td>`).join('')}</tr>`
                )
                .join('')
            : '';
          return `<table class="w-full border-collapse border border-slate-700 my-4"><tbody>${rows}</tbody></table>`;
        }
        case 'delimiter': {
          return '<hr />';
        }
        case 'image': {
          const url = block.data.file?.url || block.data.url || '';
          const caption = block.data.caption || '';
          return `<figure class="my-4"><img src="${url}" alt="${caption}" class="rounded-lg max-w-full h-auto" /><figcaption class="text-center text-xs text-slate-400 mt-2">${caption}</figcaption></figure>`;
        }
        case 'embed': {
          const embedUrl = block.data.embed || block.data.source || '';
          return `<div class="aspect-video my-4 overflow-hidden rounded-lg"><iframe src="${embedUrl}" class="w-full h-full" frameBorder="0" allowFullScreen></iframe></div>`;
        }
        case 'raw': {
          return block.data.html || '';
        }
        default:
          if (block.data?.text) {
            return `<p>${block.data.text}</p>`;
          }
          return '';
      }
    })
    .filter(Boolean)
    .join('\n');
}

export function htmlToEditorData(html: string): OutputData {
  if (!html || typeof window === 'undefined') {
    return {
      blocks: [
        {
          type: 'paragraph',
          data: { text: 'Start writing your article here...' },
        },
      ],
    };
  }

  if (html.trim().startsWith('{') && html.includes('"blocks"')) {
    try {
      return JSON.parse(html) as OutputData;
    } catch {
      // Fallback to HTML parsing
    }
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: OutputData['blocks'] = [];

  Array.from(doc.body.children).forEach((node) => {
    const tagName = node.tagName.toLowerCase();

    if (tagName.startsWith('h') && tagName.length === 2) {
      const level = parseInt(tagName[1], 10) || 2;
      blocks.push({
        type: 'header',
        data: { text: node.innerHTML, level },
      });
    } else if (tagName === 'p') {
      blocks.push({
        type: 'paragraph',
        data: { text: node.innerHTML },
      });
    } else if (tagName === 'ul' || tagName === 'ol') {
      const items = Array.from(node.querySelectorAll('li')).map((li) => li.innerHTML);
      blocks.push({
        type: 'list',
        data: {
          style: tagName === 'ol' ? 'ordered' : 'unordered',
          items,
        },
      });
    } else if (tagName === 'blockquote') {
      const p = node.querySelector('p');
      const cite = node.querySelector('cite');
      blocks.push({
        type: 'quote',
        data: {
          text: p ? p.innerHTML : node.innerHTML,
          caption: cite ? cite.innerHTML : '',
        },
      });
    } else if (tagName === 'pre') {
      const code = node.querySelector('code');
      blocks.push({
        type: 'code',
        data: { code: code ? code.textContent || '' : node.textContent || '' },
      });
    } else if (tagName === 'figure') {
      const img = node.querySelector('img');
      const figcaption = node.querySelector('figcaption');
      if (img) {
        blocks.push({
          type: 'image',
          data: {
            file: { url: img.getAttribute('src') || '' },
            caption: figcaption ? figcaption.innerHTML : img.getAttribute('alt') || '',
          },
        });
      }
    } else if (tagName === 'hr') {
      blocks.push({
        type: 'delimiter',
        data: {},
      });
    } else {
      if (node.textContent?.trim()) {
        blocks.push({
          type: 'paragraph',
          data: { text: node.innerHTML },
        });
      }
    }
  });

  if (blocks.length === 0) {
    blocks.push({
      type: 'paragraph',
      data: { text: html || 'Start writing your article...' },
    });
  }

  return { blocks };
}

export default function EditorJSComponent({
  initialContent,
  onChange,
  holderId = 'editorjs-main-container',
}: EditorJSComponentProps) {
  const ejInstance = useRef<EditorJS | null>(null);
  const onChangeRef = useRef(onChange);
  const initialContentRef = useRef(initialContent);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;

    async function initEditor() {
      const container = document.getElementById(holderId);
      if (container) {
        container.innerHTML = '';
      }

      try {
        const EditorJS = (await import('@editorjs/editorjs')).default;
        const Header = (await import('@editorjs/header')).default;
        const List = (await import('@editorjs/list')).default;
        const Code = (await import('@editorjs/code')).default;
        const Quote = (await import('@editorjs/quote')).default;
        const Delimiter = (await import('@editorjs/delimiter')).default;
        const InlineCode = (await import('@editorjs/inline-code')).default;
        const Marker = (await import('@editorjs/marker')).default;
        const Warning = (await import('@editorjs/warning')).default;
        const Table = (await import('@editorjs/table')).default;
        const Checklist = (await import('@editorjs/checklist')).default;
        const Raw = (await import('@editorjs/raw')).default;
        const Embed = (await import('@editorjs/embed')).default;
        const ImageTool = (await import('@editorjs/image')).default;

        if (!isMounted) return;

        const initialData = htmlToEditorData(initialContentRef.current);

        const editor = new EditorJS({
          holder: holderId,
          data: initialData,
          placeholder: 'Click here to write your article with Editor.js...',
          tools: {
            header: {
              class: Header as any,
              inlineToolbar: ['link', 'marker'],
              config: {
                placeholder: 'Enter a heading',
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            list: {
              class: List as any,
              inlineToolbar: true,
            },
            checklist: {
              class: Checklist as any,
              inlineToolbar: true,
            },
            image: {
              class: ImageTool as any,
              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        resolve({
                          success: 1,
                          file: {
                            url: e.target?.result as string,
                          },
                        });
                      };
                      reader.readAsDataURL(file);
                    });
                  },
                  async uploadByUrl(url: string) {
                    return {
                      success: 1,
                      file: {
                        url,
                      },
                    };
                  },
                },
              },
            },
            table: {
              class: Table as any,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
              },
            },
            code: {
              class: Code as any,
              config: {
                placeholder: 'Write code or snippet here...',
              },
            },
            quote: {
              class: Quote as any,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote author/source',
              },
            },
            warning: {
              class: Warning as any,
              inlineToolbar: true,
              config: {
                titlePlaceholder: 'Title',
                messagePlaceholder: 'Message',
              },
            },
            marker: {
              class: Marker as any,
            },
            inlineCode: {
              class: InlineCode as any,
            },
            delimiter: Delimiter as any,
            raw: Raw as any,
            embed: {
              class: Embed as any,
              config: {
                services: {
                  youtube: true,
                  github: true,
                  codepen: true,
                },
              },
            },
          },
          async onChange(api) {
            try {
              const savedData = await api.saver.save();
              const html = editorDataToHtml(savedData);
              if (onChangeRef.current) {
                onChangeRef.current(html, savedData);
              }
            } catch (e) {
              console.error('Error saving EditorJS data:', e);
            }
          },
        });

        await editor.isReady;
        if (isMounted) {
          ejInstance.current = editor;
        } else {
          editor.destroy();
        }
      } catch (error) {
        console.error('Failed to initialize EditorJS:', error);
      }
    }

    initEditor();

    return () => {
      isMounted = false;
      if (ejInstance.current && typeof ejInstance.current.destroy === 'function') {
        try {
          ejInstance.current.destroy();
        } catch {
          // Suppress destruction errors on fast remounts
        }
        ejInstance.current = null;
      }
    };
  }, [holderId]);

  return (
    <div className="editorjs-wrapper min-h-[380px] w-full p-4 rounded-input border border-slate-800 bg-slate-950 text-slate-100 font-sans text-sm focus-within:ring-2 focus-within:ring-brand-primary">
      <div id={holderId} className="prose dark:prose-invert max-w-none min-h-[340px]" />
    </div>
  );
}
