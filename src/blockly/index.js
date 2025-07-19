import Blockly from "blockly";
import { toolboxXml } from "./toolbox";
import "./customBlocks";
import { fazTudoTheme } from "./theme";

export function initBlockly(workspaceRef) {
  const workspace = Blockly.inject(workspaceRef, {
    toolbox: toolboxXml,
    theme: customTheme, // seu tema neon
    hasSounds: false,   // <- Desativa os sons
    trashcan: true,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    }
  });

  return workspace;
}

  

