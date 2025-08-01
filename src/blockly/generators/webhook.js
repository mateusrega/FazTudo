import Blockly from "blockly";

const jsGenerator = Blockly.JavaScript;

jsGenerator['webhook_trigger'] = function(block) {
  return 'console.log("Webhook recebido");\n';
};
