import { InputRule } from "@tiptap/core";
import { defaultProps } from "../../../../api/defaultProps";
import { createTipTapBlock } from "../../../../api/block";
import { BlockSpec, PropSchema } from "../../../../api/blockTypes";
import { handleEnter } from "../ListItemKeyboardShortcuts";
import {
  createDefaultBlockDOMOutputSpec,
  defaultBlockToHTML,
} from "../../defaultBlockHelpers";

export const bulletListItemPropSchema = {
  ...defaultProps,
} satisfies PropSchema;

const BulletListItemBlockContent = createTipTapBlock<"bulletListItem", true>({
  name: "bulletListItem",
  content: "inline*",

  addInputRules() {
    return [
      // Creates an unordered list when starting with "-", "+", or "*".
      new InputRule({
        find: new RegExp(`^[-+*]\\s$`),
        handler: ({ state, chain, range }) => {
          chain()
            .BNUpdateBlock(state.selection.from, {
              type: "bulletListItem",
              props: {},
            })
            // Removes the "-", "+", or "*" character used to set the list.
            .deleteRange({ from: range.from, to: range.to });
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => handleEnter(this.editor),
      "Mod-Shift-7": () =>
        this.editor.commands.BNUpdateBlock(this.editor.state.selection.anchor, {
          type: "bulletListItem",
          props: {},
        }),
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-content-type=" + this.name + "]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return createDefaultBlockDOMOutputSpec(
      this.name,
      // We use a <p> tag, because for <li> tags we'd need a <ul> element to put
      // them in to be semantically correct, which we can't have due to the
      // schema.
      "p",
      {
        ...(this.options.domAttributes?.blockContent || {}),
        ...HTMLAttributes,
      },
      this.options.domAttributes?.inlineContent || {}
    );
  },
});

export const BulletListItem = {
  node: BulletListItemBlockContent,
  propSchema: bulletListItemPropSchema,
  toInternalHTML: defaultBlockToHTML,
  toExternalHTML: defaultBlockToHTML,
  fromExternalHTML: (element, getInlineContent) => {
    const parent = element.parentElement;

    if (parent === null) {
      return undefined;
    }

    if (parent.tagName === "UL" && element.tagName === "LI") {
      return {
        type: "bulletListItem",
        content: getInlineContent(element) as any,
      };
    }

    return undefined;
  },
} satisfies BlockSpec<"bulletListItem", typeof bulletListItemPropSchema, true>;
