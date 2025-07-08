/faztudo
 ├── /public
 │    └── manifest.json              # Opcional para PWA (pode adicionar depois)
 ├── /src
 │    ├── /assets                    # (pasta para imagens, ícones)
 │    ├── /components                # Componentes reutilizáveis (futuramente)
 │    ├── /contexts                  # Contextos React (ex: usuário)
 │    │    └── UserContext.jsx
 │    ├── /hooks                     # Hooks customizados (futuramente)
 │    ├── /pages                     # Páginas principais
 │    │    ├── Login.jsx
 │    │    ├── Dashboard.jsx
 │    │    └── Builder.jsx
 │    ├── /services                  # Serviços Firebase e APIs
 │    │    └── firebase.js
 │    ├── /utils                     # Utilitários (ex: formatadores)
 │    ├── App.jsx                   # Arquivo principal de rotas e providers
 │    ├── main.jsx                  # Ponto de entrada React
 │    └── index.css                 # Estilos globais + Tailwind
 ├── tailwind.config.js              # Config Tailwind CSS
 ├── postcss.config.js               # Config PostCSS (Tailwind)
 ├── package.json                   # Dependências e scripts
 ├── vite.config.js                 # Config Vite
 └── README.md                     # Documentação do projeto
