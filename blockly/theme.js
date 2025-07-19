import * as Blockly from 'blockly/core';

export const neonTheme = Blockly.Theme.defineTheme('neonTheme', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    gatilhos: {
      colourPrimary: '#00ffff',   // Neon ciano
      colourSecondary: '#00ccff',
      colourTertiary: '#0099cc',
    },
    acoes: {
      colourPrimary: '#ff00ff',   // Neon rosa
      colourSecondary: '#cc00cc',
      colourTertiary: '#990099',
    },
    controles: {
      colourPrimary: '#39ff14',   // Neon verde
      colourSecondary: '#32cd32',
      colourTertiary: '#228b22',
    }
  },
  categoryStyles: {
    gatilhos_category: { colour: '#00ffff' },
    acoes_category: { colour: '#ff00ff' },
    controles_category: { colour: '#39ff14' },
  },
  fontStyle: {
    family: 'Rubik, sans-serif',
    weight: 'bold',
    size: 14
  },
  componentStyles: {
    workspaceBackgroundColour: '#111111',
    toolboxBackgroundColour: '#222222',
    toolboxForegroundColour: '#ffffff',
    flyoutBackgroundColour: '#1a1a1a',
    flyoutForegroundColour: '#cccccc',
    flyoutOpacity: 0.9,
    scrollbarColour: '#00ffff',
    insertionMarkerColour: '#ff00ff',
    insertionMarkerOpacity: 0.5,
    markerColour: '#39ff14',
    cursorColour: '#ffffff',
  }
});
