import Blockly from "blockly";
import { toolbox } from "./toolbox.js";
import "./customBlocks.js";
import { neonTheme } from "./theme.js";
import "blockly/generators/javascript";

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
  
  // Sobrescrever métodos de áudio de forma mais segura  
  try {
    const audioManager = workspace.getAudioManager();
    if (audioManager) {
      audioManager.play = function() { return null; };
      audioManager.load = function() { return null; };
      audioManager.preload = function() { return null; };
    }
  } catch (error) {
    console.warn("Não foi possível desabilitar áudio:", error);
  }

  return workspace;
}