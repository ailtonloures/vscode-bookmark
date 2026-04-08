# Guia de Arquitetura

## Visão Geral

O **VSCode Bookmark** é uma aplicação desktop desenvolvida com Electron que permite aos usuários salvar e gerenciar projetos e arquivos favoritos para abertura rápida no Visual Studio Code.

## Estrutura do Projeto

```
vscode-bookmark/
├── src/                      # Código fonte principal
│   ├── main.js              # Ponto de entrada da aplicação
│   ├── app.js               # Classe base da aplicação
│   ├── app.windows.js       # Implementação específica para Windows
│   ├── app.darwin.js        # Implementação específica para macOS
│   ├── app.linux.js         # Implementação específica para Linux
│   ├── preload.js           # Script de preload para segurança
│   ├── core/                # Núcleo da lógica de negócio
│   │   ├── index.js         # Exportações do core
│   │   ├── bookmark.model.js # Modelo de dados Bookmark
│   │   └── bookmark.store.js # Persistência de dados
│   └── shared/              # Utilitários compartilhados
│       ├── index.js         # Exportações compartilhadas
│       ├── platform.js      # Detecção de plataforma
│       └── auto-update.js   # Sistema de atualização automática
├── ui/                       # Interface do usuário (renderer process)
├── public/                   # Recursos estáticos
├── .github/                  # Configurações do GitHub
├── .vscode/                  # Configurações do VS Code
├── package.json             # Configuração do projeto e dependências
├── forge.config.js          # Configuração do Electron Forge
├── vite.*.config.mjs        # Configurações do Vite (build)
└── eslint.config.mjs        # Configuração do ESLint
```

## Componentes Principais

### 1. Core (Núcleo)

#### Bookmark Model (`src/core/bookmark.model.js`)
- **Responsabilidade**: Representa um bookmark no sistema
- **Atributos**:
  - `id`: Identificador único baseado em timestamp
  - `path`: Caminho original do arquivo/diretório
  - `basename`: Nome do arquivo/diretório
  - `remotePath`: Caminho remoto para integração WSL (se aplicável)
- **Métodos**:
  - `static create(path)`: Factory method para criar instâncias
  - `_getRemotePath()`: Converte caminhos WSL para formato vscode-remote
  - `_getBaseName()`: Extrai o nome do arquivo/diretório
  - `_getId()`: Gera ID baseado em timestamp

#### Bookmark Store (`src/core/bookmark.store.js`)
- **Responsabilidade**: Gerencia persistência de dados usando electron-store
- **Operações**:
  - `save(bookmark)`: Adiciona um bookmark ao início da lista
  - `get()`: Retorna todos os bookmarks salvos
  - `remove(id)`: Remove um bookmark pelo ID
- **Armazenamento**: Dados persistidos em JSON pelo electron-store

### 2. Application (Aplicação)

#### Main Entry (`src/main.js`)
- **Responsabilidade**: Ponto de entrada principal e orquestração
- **Funcionalidades**:
  - Inicializa Sentry para monitoramento de erros
  - Cria instância apropriada baseada na plataforma (Windows/macOS/Linux)
  - Registra eventos IPC para comunicação renderer-main
  - Gerencia menu de contexto do tray
  - Renderiza lista de bookmarks no menu

#### Platform-Specific Apps (`app.*.js`)
- **Responsabilidade**: Implementações específicas de cada plataforma
- **Funcionalidades comuns**:
  - `createTray()`: Cria ícone na bandeja do sistema
  - `createWindow()`: Cria janela principal
  - `createMenu()`: Cria menus nativos
  - `openEditor()`: Abre VS Code com parâmetros
  - `make()`: Inicializa a aplicação

### 3. Shared (Compartilhado)

#### Platform Detection (`src/shared/platform.js`)
- **Responsabilidade**: Detectar e abstrair diferenças entre plataformas
- **Uso**: Permite código condicional baseado em SO

#### Auto Update (`src/shared/auto-update.js`)
- **Responsabilidade**: Gerenciar atualizações automáticas da aplicação
- **Integração**: Usa `update-electron-app`

### 4. UI (Interface)

- **Responsabilidade**: Interface do usuário (renderer process)
- **Tecnologia**: Vite para build e hot-reload
- **Localização**: `ui/` directory

## Fluxo de Dados

### 1. Inicialização da Aplicação

```
main.js
  ↓
createApp() → [WindowsApp | LinuxApp | DarwinApp]
  ↓
createStore() → BookmarkStore
  ↓
app.make() → createTray() + createWindow()
  ↓
registerIpcMainEvents()
  ↓
registerAppEvents()
  ↓
renderApp() → Menu do Tray
```

### 2. Adicionar Bookmark

```
Usuário clica "Add project" no menu
  ↓
Dialog abre para selecionar diretório
  ↓
Bookmark.create(path) cria modelo
  ↓
store.save(bookmark) persiste dados
  ↓
renderApp() atualiza menu do tray
```

### 3. Abrir Bookmark

```
Usuário seleciona bookmark no menu
  ↓
Verifica se é caminho remoto (WSL)
  ↓
Se remoto: vscode-remote://protocol
Se local: caminho direto
  ↓
app.openEditor() executa VS Code
```

### 4. Remover Bookmark

```
Usuário clica "Remove" no submenu
  ↓
store.remove(bookmark.id) remove dos dados
  ↓
renderApp() atualiza menu do tray
```

## Tecnologias Utilizadas

| Categoria | Tecnologia | Finalidade |
|-----------|-----------|------------|
| **Framework** | Electron | Aplicação desktop cross-platform |
| **Build** | Vite | Bundler e dev server |
| **Package** | Electron Forge | Empacotamento e distribuição |
| **State** | electron-store | Persistência de dados |
| **Monitoring** | Sentry | Monitoramento de erros |
| **Update** | update-electron-app | Atualizações automáticas |
| **Lint** | ESLint + Prettier | Qualidade de código |
| **Git Hooks** | Husky + lint-staged | Pre-commit hooks |

## Padrões de Design

### 1. Factory Pattern
```javascript
// Bookmark.create(path) retorna nova instância
static create(path) {
  return new Bookmark(path);
}
```

### 2. Strategy Pattern (Platform-specific)
```javascript
// Diferentes implementações por plataforma
if (platform('win32')) return new WindowsApp(electron);
if (platform('darwin')) return new DarwinApp(electron);
```

### 3. Observer Pattern (IPC Events)
```javascript
// Comunicação entre main e renderer processes
ipcMain.on('save-bookmark', (event, path) => { ... });
event.reply('save-bookmark', 'OK');
```

## Melhorias Futuras

### Funcionalidades
- [ ] Sincronização em nuvem (iCloud, Google Drive, OneDrive)
- [ ] Tags e categorias para organização
- [ ] Busca avançada com filtros
- [ ] Exportar/importar bookmarks
- [ ] Atalhos de teclado personalizáveis
- [ ] Ícones personalizados por projeto
- [ ] Ordem customizada (drag-and-drop)

### Técnicas
- [ ] TypeScript para type safety
- [ ] Testes unitários (Jest/Vitest)
- [ ] Testes E2E (Playwright)
- [ ] CI/CD pipeline
- [ ] Documentação de API (JSDoc completo)
- [ ] Changelog automatizado

### UX
- [ ] Preview de projetos
- [ ] Histórico de aberturas
- [ ] Favoritos frequentes
- [ ] Temas personalizados
- [ ] Multi-language support

## Segurança

### Preload Script
- Isola o renderer process do main process
- Expõe apenas APIs seguras via contextBridge
- Previne acesso direto ao Node.js

### Electron Fuses
- Configurado em `forge.config.js`
- Desabilita recursos não utilizados
- Aumenta segurança da aplicação

## Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

Consulte [CONTRIBUTING.md](../CONTRIBUTING.md) para detalhes.

## Licença

MIT License - veja [LICENSE](../LICENSE) para detalhes.
