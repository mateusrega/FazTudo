import Blockly from "blockly";

export const neonTheme = Blockly.Theme.defineTheme('neon', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    gatilhos: {
      colourPrimary: '#FF6B6B',
      colourSecondary: '#FF5252',  
      colourTertiary: '#E53E3E',
      hat: 'cap'
    },
    acoes: {
      colourPrimary: '#4ECDC4',
      colourSecondary: '#26C6DA',
      colourTertiary: '#00ACC1'
    },
    logica: {
      colourPrimary: '#FFE066',
      colourSecondary: '#FFD54F',
      colourTertiary: '#FFC107'
    },
    texto: {
      colourPrimary: '#A78BFA',
      colourSecondary: '#9F7AEA',
      colourTertiary: '#805AD5'
    },
    variaveis: {
      colourPrimary: '#F687B3',
      colourSecondary: '#ED64A6',
      colourTertiary: '#D53F8C'
    }
  },
  categoryStyles: {
    gatilhos_category: { colour: '#FF6B6B' },
    acoes_category: { colour: '#4ECDC4' },
    logica_category: { colour: '#FFE066' },
    texto_category: { colour: '#A78BFA' },
    variaveis_category: { colour: '#F687B3' }
  },
  componentStyles: {
    workspaceBackgroundColour: '#1A202C',
    toolboxBackgroundColour: '#2D3748',
    toolboxForegroundColour: '#E2E8F0',
    flyoutBackgroundColour: '#2D3748',
    flyoutForegroundColour: '#CBD5E0',
    flyoutOpacity: 0.9,
    scrollbarColour: '#4A5568',
    insertionMarkerColour: '#63B3ED',
    insertionMarkerOpacity: 0.5,
    scrollbarOpacity: 0.8,
    cursorColour: '#63B3ED'
  },
  fontStyle: {
    family: 'Inter, system-ui, sans-serif',
    size: 12,
    weight: '500'
  }
});
