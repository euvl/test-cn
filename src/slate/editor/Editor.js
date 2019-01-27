import { Editor as SlateEditor } from "slate-react";
import { Value } from "slate";

import React, { Component } from "react";

import Suggestions from "./Suggestions";
import Heading from "./Heading";
import Paragraph from "./Paragraph";

import TermList from "./TermList";

import schema from "./schema";
import basicSchema from "./basicSchema";

const CAPTURE_REGEX = /@(\S*)$/;
const SEARCH_MARK_TYPE = "mentionContext";

const getInput = value => {
  // In some cases, like if the node that was selected gets deleted,
  // `startText` can be null.
  if (!value.startText) {
    return null;
  }

  const startOffset = value.selection.start.offset;
  const textBefore = value.startText.text.slice(0, startOffset);
  const result = CAPTURE_REGEX.exec(textBefore);

  return result === null ? null : result[1];
};

function hasValidAncestors(value) {
  const { document, selection } = value;

  const invalidParent = document.getClosest(
    selection.start.key,
    // In this simple case, we only want mentions to live inside a paragraph.
    // This check can be adjusted for more complex rich text implementations.
    node => node.type !== "paragraph" && node.type !== "heading"
  );

  return !invalidParent;
}

const schemaDefaultValue = {
  document: {
    nodes: [
      {
        object: "block",
        type: "heading",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: ""
              }
            ]
          }
        ]
      }
    ]
  }
};

const basicSchemaDefaultValue = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: ""
              }
            ]
          }
        ]
      }
    ]
  }
};

class ForcedLayout extends Component {
  editorRef = React.createRef();

  constructor(props) {
    super(props);

    const defaultValue =
      this.props.defaultValue ||
      (this.props.type === "simple"
        ? basicSchemaDefaultValue
        : schemaDefaultValue);

    this.state = {
      defaultValue: Value.fromJSON(defaultValue),
      terms: []
    };
  }

  render() {
    return (
      <div>
        <label>{this.props.label}</label>

        <div className="layout">
          <div className="layout-left">
            <SlateEditor
              className="editor"
              placeholder="Enter a title..."
              defaultValue={this.state.defaultValue}
              schema={this.props.type === "simple" ? basicSchema : schema}
              ref={this.editorRef}
              renderNode={this.renderNode}
              renderMark={this.renderMark}
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}
            />
            <Suggestions
              anchor=".search-word-context"
              terms={this.state.terms}
              onSelect={this.insertMention}
            />
          </div>
          <div className="layout-right">
            <TermList terms={this.props.options} />
          </div>
        </div>
      </div>
    );
  }

  renderMark(props, editor, next) {
    if (props.mark.type === SEARCH_MARK_TYPE) {
      return (
        <span {...props.attributes} className="search-word-context">
          {props.children}
        </span>
      );
    }

    return next();
  }

  insertParagraph = (editor, paragraph = "") => {
    return editor
      .insertBlock("paragraph")
      .insertText(paragraph)
      .focus();
  };

  insertHeading = (editor, heading = "") => {
    return editor
      .insertBlock("heading")
      .insertText(heading)
      .focus();
  };

  insertHeadingWithParagraph = (editor, heading = "", paragraph = "") => {
    return editor
      .insertBlock("heading")
      .insertText(heading)
      .insertBlock("paragraph")
      .insertText(paragraph)
      .focus();
  };

  insertMention = term => {
    const value = this.state.value;
    const inputValue = getInput(value);
    const editor = this.editorRef.current;
    const block = editor.value.blocks.first();
    const deleteCharacterCount = inputValue.length + 1;

    if (block) {
      if (block.type === "heading") {
        editor
          .deleteBackward(value.startText.text.length)
          .insertText(term.text)
          .focus();
      }

      if (block.type === "paragraph") {
        editor.removeNodeByKey(block.key);

        this.insertHeadingWithParagraph(
          editor,
          term.text,
          value.startText.text
        );

        editor.deleteBackward(deleteCharacterCount).focus();
      }
    }
  };

  onKeyDown = (event, editor, next) => {
    switch (event.key) {
      case "Enter":
        if (this.props.type === "simple") {
          return next();
        } else {
          return this.onEnter(event, editor, next);
        }
      case "Tab":
        return this.onTab(event, editor, next);
      default:
        return next();
    }
  };

  onTab = (event, editor, next) => {
    const { terms } = this.state;

    if (terms && terms.length > 0) {
      this.insertMention(terms[0]);
    }
    /**
     * GOTO: default
     */
    event.preventDefault();
  };

  onEnter = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;
    const { start, end, isExpanded } = selection;

    if (isExpanded) {
      return next();
    }

    const { startBlock } = value;

    const isPreviousParagraphEmpty =
      start.offset === 0 && end.offset === 0 && startBlock.text.length === 0;
    /**
     * Create heading if previous paragraph is empty
     */
    if (isPreviousParagraphEmpty) {
      event.preventDefault();
      editor.setBlocks("heading");
      return;
    }

    if (startBlock.type !== "heading") {
      return next();
    }
    /**
     * Create paragraph
     */
    event.preventDefault();
    editor.splitBlock().setBlocks("paragraph");
  };

  search = searchQuery => {
    this.setState({
      terms: []
    });

    if (!searchQuery) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      const regex = RegExp(`^${searchQuery}`, "gi");

      this.setState({
        terms: this.props.options.filter(
          term => term.text.match(regex) || term.code.match(regex)
        )
      });
    }, 50);
  };

  onChange = change => {
    const inputValue = getInput(change.value);

    if (inputValue !== this.lastInputValue) {
      this.lastInputValue = inputValue;

      if (hasValidAncestors(change.value)) {
        this.search(inputValue);
      }

      const { selection } = change.value;

      let decorations = change.value.decorations.filter(
        value => value.mark.type !== SEARCH_MARK_TYPE
      );

      if (inputValue && hasValidAncestors(change.value)) {
        decorations = decorations.push({
          anchor: {
            key: selection.start.key,
            offset: selection.start.offset - inputValue.length
          },
          focus: {
            key: selection.start.key,
            offset: selection.start.offset
          },
          mark: {
            type: SEARCH_MARK_TYPE
          }
        });
      }

      this.setState({ value: change.value }, () => {
        // We need to set decorations after the value flushes into the editor.
        this.editorRef.current.setDecorations(decorations);
      });
      return;
    }

    this.setState({ value: change.value });
  };

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;

    window.editor = editor;

    switch (node.type) {
      case "heading":
        return <Heading {...attributes}>{children}</Heading>;
      case "paragraph":
        return <Paragraph {...attributes}>{children}</Paragraph>;
      default:
        return next();
    }
  };
}

ForcedLayout.defaultProps = {
  options: []
};

export default ForcedLayout;
