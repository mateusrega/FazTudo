// src/pages/Builder.jsx
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import VoiceRecorder from "../components/VoiceRecorder";
import { 
  FaLightbulb, 
  FaRocket, 
  FaExpand, 
  FaCompress, 
  FaPlay, 
  FaDownload, 
  FaSave,
  FaTrash,
  FaUndo,
  FaRedo,
  FaCode,
  FaCog,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";

export default function Builder() {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspaceRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("Minha Automação");

  // Configuração customizada do Blockly
  const blocklyConfig = {
    toolbox: toolbox.current,
    trashcan: true,
    horizontalLayout: false,
    zoom: { 
      controls: true, 
      wheel: true, 
      startScale: 0.9, 
      maxScale: 2, 
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    move: {
      scrollbars: {
        horizontal: true,
        vertical: true
      },
      drag: true,
      wheel: true
    },
    grid: {
      spacing: 20,
      length: 3,
      colour: '#e5e7eb',
      snap: true
    },
    theme: {
      'base': Blockly.Themes.Classic,
      'categoryStyles': {
        'logic_category': {
          'colour': '#5b67a5'
        },
        'loop_category': {
          'colour': '#5ba55b'
        },
        'math_category': {
          'colour': '#5b80a5'
        },
        'text_category': {
          'colour': '#5ba58c'
        },
        'list_category': {
          'colour': '#745ba5'
        },
        'colour_category': {
          'colour': '#a55b80'
        },
        'variable_category': {
          'colour': '#a55b5b'
        },
        'function_category': {
          'colour': '#995ba5'
        }
      },
      'blockStyles': {
        'logic_blocks': {
          'colourPrimary': '#4f46e5',
          'colourSecondary': '#6366f1',
          'colourTertiary': '#818cf8'
        },
        'loop_blocks': {
          'colourPrimary': '#059669',
          'colourSecondary': '#10b981',
          'colourTertiary': '#34d399'
        },
        'math_blocks': {
          'colourPrimary': '#dc2626',
          'colourSecondary': '#ef4444',
          'colourTertiary': '#f87171'
        },
        'text_blocks': {
          'colourPrimary': '#7c2d12',
          'colourSecondary': '#ea580c',
          'colourTertiary': '#fb923c'
        }
      }
    }
  };

  // Inicializa o Blockly
  useEffect(() => {
    if (!blocklyDiv.current || !toolbox.current) return;

    workspaceRef.current = Blockly.inject(blocklyDiv.current, blocklyConfig);

    // Customizar aparência
    const workspace = workspaceRef.current;
    
    // Ajustar lixeira
    if (workspace.trashcan_) {
      workspace.trashcan_.svgGroup_.setAttribute("transform", "translate(0,-60) scale(0.8)");
    }

    // Listener para mudanças no workspace
    workspace.addChangeListener(() => {
      const code = Blockly.JavaScript.workspaceToCode(workspace);
      setGeneratedCode(code);
    });

    // Redimensionamento automático
    const resizeObserver = new ResizeObserver(() => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    });
    resizeObserver.observe(blocklyDiv.current);

    return () => {
      resizeObserver.disconnect();
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  // Ajusta Blockly ao alternar fullscreen
  useEffect(() => {
    if (workspaceRef.current) {
      setTimeout(() => Blockly.svgResize(workspaceRef.current), 100);
    }
  }, [isFullscreen]);

  // Função de comando de voz para criar blocos
  const handleVoiceCommand = (text) => {
    if (!workspaceRef.current) return;
    const cmd = text.toLowerCase();

    let blockXml = null;

    if (cmd.includes("loop") || cmd.includes("repetir")) {
      blockXml = '<block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block>';
    } else if (cmd.includes("se") || cmd.includes("condição")) {
      blockXml = '<block type="controls_if"></block>';
    } else if (cmd.includes("imprimir") || cmd.includes("mostrar")) {
      blockXml = '<block type="text_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Olá mundo!</field></shadow></value></block>';
    } else if (cmd.includes("variável")) {
      blockXml = '<block type="variables_set"><field name="VAR">item</field></block>';
    } else if (cmd.includes("número")) {
      blockXml = '<block type="math_number"><field name="NUM">42</field></block>';
    } else if (cmd.includes("texto")) {
      blockXml = '<block type="text"><field name="TEXT">texto</field></block>';
    }

    if (blockXml) {
      const block = Blockly.Xml.domToBlock(Blockly.Xml.textToDom(blockXml), workspaceRef.current);
      block.moveBy(50, 50);
      workspaceRef.current.centerOnBlock(block.id);
    }
  };

  const handleSaveWorkspace = () => {
    if (!workspaceRef.current) return;
    const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
    const xmlText = Blockly.Xml.domToText(xml);
    
    const blob = new Blob([xmlText], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workspaceName.replace(/\s+/g, '_')}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearWorkspace = () => {
    if (workspaceRef.current && confirm('Tem certeza que deseja limpar todo o workspace?')) {
      workspaceRef.current.clear();
    }
  };

  const handleUndo = () => {
    if (workspaceRef.current) {
      workspaceRef.current.undo(false);
    }
  };

  const handleRedo = () => {
    if (workspaceRef.current) {
      workspaceRef.current.undo(true);
    }
  };

  const handleRunCode = () => {
    if (generatedCode.trim()) {
      try {
        // Executar código em um contexto seguro
        const result = eval(generatedCode);
        console.log("Resultado da execução:", result);
        alert("Código executado com sucesso! Verifique o console para ver os resultados.");
      } catch (error) {
        console.error("Erro na execução:", error);
        alert(`Erro na execução: ${error.message}`);
      }
    } else {
      alert("Nenhum código para executar. Adicione alguns blocos primeiro!");
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex ${isFullscreen ? "overflow-hidden" : ""}`}>
      {!isFullscreen && <Sidebar />}

      <div className={`flex-1 ${isFullscreen ? "p-0" : "lg:ml-64 p-4 md:p-6"}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="mb-6 pt-16 lg:pt-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <FaRocket className="text-white text-xl" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="text-2xl md:text-3xl font-bold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded-lg transition-all"
                    />
                    <p className="text-gray-600 text-sm md:text-base">
                      Construa automações visuais arrastando e conectando blocos
                    </p>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowVoice(!showVoice)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    showVoice 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-green-400'
                  }`}
                >
                  🎤 Voz
                </button>

                <button
                  onClick={() => setShowCode(!showCode)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    showCode 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {showCode ? <FaEyeSlash /> : <FaEye />}
                  Código
                </button>

                <button
                  onClick={() => setIsFullscreen(true)}
                  className="px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  <FaExpand /> Tela Cheia
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={handleRunCode}
                className="btn-blue flex items-center gap-2"
              >
                <FaPlay /> Executar
              </button>
              
              <button
                onClick={handleSaveWorkspace}
                className="btn-indigo flex items-center gap-2"
              >
                <FaSave /> Salvar
              </button>

              <button
                onClick={handleUndo}
                className="btn-purple flex items-center gap-2"
              >
                <FaUndo /> Desfazer
              </button>

              <button
                onClick={handleRedo}
                className="btn-purple flex items-center gap-2"
              >
                <FaRedo /> Refazer
              </button>
              
              <button
                onClick={handleClearWorkspace}
                className="btn-red flex items-center gap-2"
              >
                <FaTrash /> Limpar
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`${isFullscreen ? 'h-screen' : 'h-auto'} ${showCode ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}`}>
          {/* Editor */}
          <div
            className={`relative bg-white shadow-xl border border-gray-200 transition-all duration-300 ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none" : "rounded-2xl"
            } ${showCode && !isFullscreen ? 'min-h-[500px]' : ''}`}
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <FaCog className="text-white text-sm" />
                </div>
                <h3 className="font-semibold text-gray-900">Editor Visual</h3>
              </div>

              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-red-600 transition-all duration-200"
                >
                  <FaCompress /> Fechar
                </button>
              )}
            </div>

            {/* Blockly Workspace */}
            <div
              ref={blocklyDiv}
              style={{
                height: isFullscreen ? "calc(100vh - 80px)" : showCode ? "500px" : "600px",
                width: "100%",
                minHeight: "400px",
              }}
              className="blockly-workspace"
            />

            {/* Toolbox */}
            <xml
              xmlns="https://developers.google.com/blockly/xml"
              style={{ display: "none" }}
              ref={toolbox}
            >
              <category name="🧠 Lógica" colour="#4f46e5" categorystyle="logic_category">
                <block type="controls_if"></block>
                <block type="controls_ifelse"></block>
                <block type="logic_compare"></block>
                <block type="logic_operation"></block>
                <block type="logic_negate"></block>
                <block type="logic_boolean"></block>
                <block type="logic_null"></block>
                <block type="logic_ternary"></block>
              </category>

              <category name="🔄 Loops" colour="#059669" categorystyle="loop_category">
                <block type="controls_repeat_ext">
                  <value name="TIMES">
                    <shadow type="math_number">
                      <field name="NUM">10</field>
                    </shadow>
                  </value>
                </block>
                <block type="controls_whileUntil"></block>
                <block type="controls_for">
                  <value name="FROM">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="TO">
                    <shadow type="math_number">
                      <field name="NUM">10</field>
                    </shadow>
                  </value>
                  <value name="BY">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                </block>
                <block type="controls_forEach"></block>
                <block type="controls_flow_statements"></block>
              </category>

              <category name="🔢 Matemática" colour="#dc2626" categorystyle="math_category">
                <block type="math_number">
                  <field name="NUM">123</field>
                </block>
                <block type="math_arithmetic">
                  <value name="A">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="B">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_single">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">9</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_trig">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">45</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_constant"></block>
                <block type="math_random_int">
                  <value name="FROM">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <value name="TO">
                    <shadow type="math_number">
                      <field name="NUM">100</field>
                    </shadow>
                  </value>
                </block>
                <block type="math_random_float"></block>
              </category>

              <category name="📝 Texto" colour="#7c2d12" categorystyle="text_category">
                <block type="text">
                  <field name="TEXT">Olá mundo!</field>
                </block>
                <block type="text_join"></block>
                <block type="text_append">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">texto</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_length">
                  <value name="VALUE">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_isEmpty">
                  <value name="VALUE">
                    <shadow type="text">
                      <field name="TEXT"></field>
                    </shadow>
                  </value>
                </block>
                <block type="text_indexOf">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">texto</field>
                    </block>
                  </value>
                  <value name="FIND">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_charAt">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">texto</field>
                    </block>
                  </value>
                </block>
                <block type="text_print">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
              </category>

              <category name="📋 Listas" colour="#745ba5" categorystyle="list_category">
                <block type="lists_create_with">
                  <mutation items="0"></mutation>
                </block>
                <block type="lists_create_with"></block>
                <block type="lists_repeat">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">5</field>
                    </shadow>
                  </value>
                </block>
                <block type="lists_length"></block>
                <block type="lists_isEmpty"></block>
                <block type="lists_indexOf">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">lista</field>
                    </block>
                  </value>
                </block>
                <block type="lists_getIndex">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">lista</field>
                    </block>
                  </value>
                </block>
                <block type="lists_setIndex">
                  <value name="LIST">
                    <block type="variables_get">
                      <field name="VAR">lista</field>
                    </block>
                  </value>
                </block>
              </category>

              <category name="🎨 Cores" colour="#a55b80" categorystyle="colour_category">
                <block type="colour_picker"></block>
                <block type="colour_random"></block>
                <block type="colour_rgb">
                  <value name="RED">
                    <shadow type="math_number">
                      <field name="NUM">100</field>
            </shadow>
                  </value>
                </block>
                <block type="math_random_float"></block>
              </category>

              <category name="📝 Texto" colour="#7c2d12" categorystyle="text_category">
                <block type="text">
                  <field name="TEXT">Olá mundo!</field>
                </block>
                <block type="text_join"></block>
                <block type="text_append">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">texto</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_length">
                  <value name="VALUE">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_isEmpty">
                  <value name="VALUE">
                    <shadow type="text">
                      <field name="TEXT"></field>
                    </shadow>
                  </value>
                </block>
                <block type="text_indexOf">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">texto</field>
                    </block>
                  </value>
                  <value name="FIND">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
                <block type="text_charAt">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">texto</field>
                    </block>
                  </value>
                </block>
                <block type="text_print">
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">abc</field>
                    </shadow>
                  </value>
                </block>
              </category>

              <category name="📋 Listas" colour="#745ba5" categorystyle="list_category">
                <block type="lists_create_with">
                  <mutation items="0"></mutation>
                </block>
                <block type="lists_create_with"></block>
                <block type="lists_repeat">
                  <value name="NUM">
                    <shadow type="math_number">
                      <field name="NUM">5</field>
                    </shadow>
                  </value>
                </block>
                <block type="lists_length"></block>
                <block type="lists_isEmpty"></block>
                <block type="lists_indexOf">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">lista</field>
                    </block>
                  </value>
                </block>
                <block type="lists_getIndex">
                  <value name="VALUE">
                    <block type="variables_get">
                      <field name="VAR">lista</field>
                    </block>
                  </value>
                </block>
                <block type="lists_setIndex">
                  <value name="LIST">
                    <block type="variables_get">
                      <field name="VAR">lista</field>
                    </block>
                  </value>
                </block>
              </category>

              <category name="🎨 Cores" colour="#a55b80" categorystyle="colour_category">
                <block type="colour_picker"></block>
                <block type="colour_random"></block>
                <block type="colour_rgb">
                  <value name="RED">
                    <shadow type="math_number">
                      <field name="NUM">100</field>
                    </shadow>
                  </value>
                  <value name="GREEN">
                    <shadow type="math_number">
                      <field name="NUM">50</field>
                    </shadow>
                  </value>
                  <value name="BLUE">
                    <shadow type="math_number">
                      <field name="NUM">0</field>
                    </shadow>
                  </value>
                </block>
                <block type="colour_blend">
                  <value name="COLOUR1">
                    <shadow type="colour_picker">
                      <field name="COLOUR">#ff0000</field>
                    </shadow>
                  </value>
                  <value name="COLOUR2">
                    <shadow type="colour_picker">
                      <field name="COLOUR">#3333ff</field>
                    </shadow>
                  </value>
                  <value name="RATIO">
                    <shadow type="math_number">
                      <field name="NUM">0.5</field>
                    </shadow>
                  </value>
                </block>
              </category>

              <category name="📦 Variáveis" colour="#a55b5b" categorystyle="variable_category" custom="VARIABLE"></category>
              <category name="⚙️ Funções" colour="#995ba5" categorystyle="function_category" custom="PROCEDURE"></category>
            </xml>
          </div>

          {/* Code Panel */}
          {showCode && !isFullscreen && (
            <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                    <FaCode className="text-white text-sm" />
                  </div>
                  <h3 className="font-semibold text-white">Código Gerado</h3>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <FaDownload className="inline mr-1" /> Copiar
                </button>
              </div>
              <div className="p-4 h-[500px] overflow-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {generatedCode || "// Nenhum código gerado ainda\n// Adicione alguns blocos para ver o código aqui!"}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Voice Recorder */}
        {showVoice && !isFullscreen && (
          <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                  🎤
                </div>
                <h3 className="font-semibold text-gray-900">Comando de Voz</h3></div>
              <VoiceRecorder onResult={handleVoiceCommand} />
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Comandos disponíveis:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded">• "loop" ou "repetir"</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">• "se" ou "condição"</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">• "imprimir" ou "mostrar"</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">• "variável"</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">• "número"</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">• "texto"</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        {!isFullscreen && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl flex-shrink-0">
                <FaLightbulb className="text-yellow-600 text-xl" />
