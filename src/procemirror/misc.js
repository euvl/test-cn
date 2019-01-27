import {
  inputRules,
  wrappingInputRule,
  //  textblockTypeInputRule,
  smartQuotes,
  emDash,
  ellipsis
} from "prosemirror-inputrules";

// import commands from "./commands";

export function blockQuoteRule(nodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

export function buildInputRules(schema) {
  let rules = smartQuotes.concat(ellipsis, emDash);

  rules.push(blockQuoteRule(schema.nodes.blockquote));

  return inputRules({ rules });
}


buildInputRules(schema),