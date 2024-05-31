import { BlockNoteSchema, defaultStyleSpecs } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  createReactStyleSpec,
  FormattingToolbar,
  FormattingToolbarController,
  FormattingToolbarProps,
  useActiveStyles,
  useBlockNoteEditor,
  useComponentsContext,
  useContent,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

const Small = () => {
  const contentProps = useContent();

  return <small {...contentProps} />;
};

const small = createReactStyleSpec(
  {
    type: "small",
    propSchema: "boolean",
  },
  {
    render: Small,
  }
);

const FontSize = (props: { value: string }) => {
  const { style, ...rest } = useContent();

  return <span style={{ fontSize: props.value, ...style }} {...rest} />;
};

const fontSize = createReactStyleSpec(
  {
    type: "fontSize",
    propSchema: "string",
  },
  {
    render: FontSize,
  }
);

export const schema = BlockNoteSchema.create({
  styleSpecs: {
    ...defaultStyleSpecs,
    small,
    fontSize,
  },
});

const CustomFormattingToolbar = (props: FormattingToolbarProps) => {
  const editor = useBlockNoteEditor(schema);
  const activeStyles = useActiveStyles(editor);

  const Components = useComponentsContext()!;

  return (
    <FormattingToolbar>
      <Components.FormattingToolbar.Button
        mainTooltip={"small"}
        onClick={() => {
          editor.toggleStyles({
            small: true,
          });
        }}
        isSelected={activeStyles.small}>
        Small
      </Components.FormattingToolbar.Button>
      <Components.FormattingToolbar.Button
        mainTooltip={"font size"}
        onClick={() => {
          editor.toggleStyles({
            fontSize: "30px",
          });
        }}
        isSelected={!!activeStyles.fontSize}>
        Font size
      </Components.FormattingToolbar.Button>
    </FormattingToolbar>
  );
};

export default function App() {
  const editor = useCreateBlockNote(
    {
      schema,
      initialContent: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "large text",
              styles: {
                fontSize: "30px",
              },
            },
            {
              type: "text",
              text: "small text",
              styles: {
                small: true,
              },
            },
          ],
        },
      ],
    },
    []
  );

  return (
    <BlockNoteView className="root" editor={editor} formattingToolbar={false}>
      <FormattingToolbarController
        formattingToolbar={CustomFormattingToolbar}
      />
    </BlockNoteView>
  );
}
