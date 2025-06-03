import Highlight from '@tiptap/extension-highlight';

export const customHighlight = Highlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: false,
      HTMLAttributes: {
        class: 'custom-highlight',
        style: 'background-color: #81C784;',
      },
    };
  },
});
