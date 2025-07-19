import Blockly from "blockly";

export const neonTheme = Blockly.Theme.defineTheme('neon', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    gatilhos: {
      colourPrimary: '#00FFF7',
      colourSecondary: '#00D4C2',
      colourTertiary: '#00AAA0'
    },
    acoes: {
      colourPrimary: '#00FF85',
      colourSecondary: '#00C76B',
      colourTertiary: '#009E56'
    },
    logica: {
      colourPrimary: '#FFFD00',
      colourSecondary: '#D4D000',
      colourTertiary: '#AAA700'
    },
    texto: {
      colourPrimary: '#FF44FF',
      colourSecondary: '#D438D4',
      colourTertiary: '#A32CA3'
    },
    variaveis: {
      colourPrimary: '#FFAA00',
      colourSecondary: '#D48F00',
      colourTertiary: '#AA7500'
    }
  },
  categoryStyles: {
    gatilhos_category: { colour: '#00FFF7' },
    acoes_category: { colour: '#00FF85' },
    logica_category: { colour: '#FFFD00' },
    texto_category: { colour: '#FF44FF' },
    variaveis_category: { colour: '#FFAA00' }
  },
  componentStyles: {
    workspaceBackgroundColour: '#111',
    toolboxBackgroundColour: '#191919',
    toolboxForegroundColour: '#ffffff',
    flyoutBackgroundColour: '#222',
    flyoutForegroundColour: '#ccc',
    flyoutOpacity: 0.8,
    scrollbarColour: '#00FFF7',
    insertionMarkerColour: '#ffffff',
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.8,
    cursorColour: '#00FFF7'
  },
  fontStyle: {
    family: 'Roboto Mono, monospace',
    size: 14,
    weight: 'bold'
  }
});
