import Blockly from "blockly";
import { toolbox } from "./toolbox";
import "./customBlocks";
import { neonTheme } from "./theme";

export function initBlockly(workspaceRef) {
  const workspace = Blockly.inject(workspaceRef, {
    toolbox: toolbox,
    theme: neonTheme,
    sounds: false,
    trashcan: true,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    grid: {
      spacing: 20,
      length: 3,
      colour: '#333',
      snap: true
    },
    move: {
      scrollbars: {
        horizontal: true,
        vertical: true
      },
      drag: true,
      wheel: true
    }
  });

  // Desativar completamente todos os sons
  workspace.getAudioManager().setVolume(0);
  workspace.getAudioManager().play = function() { return null; };
  workspace.getAudioManager().load = function() { return null; };
  workspace.getAudioManager().preload = function() { return null; };

  return workspace;
}