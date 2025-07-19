export const neonTheme = Blockly.Theme.defineTheme('neon', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    action_blocks: {
      colourPrimary: '#00FFC6', // Neon verde-água
      colourSecondary: '#00AA8D',
      colourTertiary: '#007F6A',
    },
    trigger_blocks: {
      colourPrimary: '#FF00C8', // Neon rosa
      colourSecondary: '#AA0091',
      colourTertiary: '#7A006B',
    },
    logic_blocks: {
      colourPrimary: '#FFFD00', // Neon amarelo
      colourSecondary: '#B7B200',
      colourTertiary: '#7F7C00',
    },
    control_blocks: {
      colourPrimary: '#00A2FF', // Neon azul
      colourSecondary: '#0073B2',
      colourTertiary: '#005080',
    },
    debug_blocks: {
      colourPrimary: '#FFA500', // Laranja
      colourSecondary: '#CC8400',
      colourTertiary: '#996300',
    },
  },
  categoryStyles: {
    actions_category: { colour: '#00FFC6' },
    triggers_category: { colour: '#FF00C8' },
    logic_category: { colour: '#FFFD00' },
    control_category: { colour: '#00A2FF' },
    debug_category: { colour: '#FFA500' },
  },
  componentStyles: {
    workspaceBackgroundColour: '#0a0a0a',
    toolboxBackgroundColour: '#0f0f0f',
    toolboxForegroundColour: '#ffffff',
    flyoutBackgroundColour: '#1c1c1c',
    flyoutForegroundColour: '#cccccc',
    insertionMarkerColour: '#ffffff',
    insertionMarkerOpacity: 0.3,
    scrollbarColour: '#00FFC6',
    scrollbarOpacity: 0.6,
    cursorColour: '#FF00C8',
  },
  fontStyle: {
    family: 'Fira Code, monospace',
    weight: 'bold',
    size: 14,
  }
});
