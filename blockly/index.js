import Blockly from "blockly";
import "blockly/blocks";
import "blockly/javascript";
import { toolboxXml } from "./toolbox";
import "./customBlocks";

export function initBlockly(workspaceRef) {
  const workspace = Blockly.inject(workspaceRef, {
    toolbox: toolboxXml,
    scrollbars: true,
    trashcan: true,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
  });

  return workspace;
}
