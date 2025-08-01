import Blockly from "blockly";

const jsGenerator = Blockly.JavaScript;

// Aqui você define geradores customizados para blocos lógicos, se tiver
// Exemplo:
jsGenerator['controls_if'] = function(block) {
  const condition = jsGenerator.valueToCode(block, 'IF0', jsGenerator.ORDER_NONE) || 'false';
  const statements = jsGenerator.statementToCode(block, 'DO0');
  return `if (${condition}) {\n${statements}}\n`;
};
