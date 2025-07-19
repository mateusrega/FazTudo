import Blockly from "blockly/core";

export const fazTudoTheme = Blockly.Theme.defineTheme("fazTudoTheme", {
  base: Blockly.Themes.Classic, // ou 'Modern'
  blockStyles: {
    gatilhos: {
      colourPrimary: "#FFDD00", // Neon amarelo
      colourSecondary: "#FFE680",
      colourTertiary: "#FFF6BF"
    },
    acoes: {
      colourPrimary: "#00FFD0", // Neon água
      colourSecondary: "#80FFEB",
      colourTertiary: "#BFFFF6"
    }
  },
  categoryStyles: {
    gatilhos_category: {
      colour: "#FFDD00"
    },
    acoes_category: {
      colour: "#00FFD0"
    }
  },
  componentStyles: {
    workspaceBackgroundColour: "#0d0d0d",
    toolboxBackgroundColour: "#1a1a1a",
    toolboxForegroundColour: "#fff",
    flyoutBackgroundColour: "#121212",
    flyoutForegroundColour: "#ccc",
    flyoutOpacity: 1,
    scrollbarColour: "#00FFD0",
    insertionMarkerColour: "#fff",
    insertionMarkerOpacity: 0.4,
    cursorColour: "#00FF88",
    selectedGlowColour: "#00FF88",
    selectedGlowSize: 2,
    replacementGlowColour: "#FF5555",
    replacementGlowSize: 2
  },
  fontStyle: {
    family: "Inter, sans-serif",
    size: 14,
    weight: "600"
  }
});
