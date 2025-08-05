# 🎨 NFT DApp

Aplicação em React.js para o projeto de NFTs com pagamento em tokens ERC-20, integrado com RainbowKit para conexão de carteiras.

## 🚀 Funcionalidades Implementadas

### ✅ **Header com RainbowKit**
- Conexão de carteira integrada
- Exibição do saldo de tokens ERC-20 no cabeçalho
- Informações da rede conectada
- Design responsivo

### ✅ **Painel de Administração** (`/admin`)
- **Cunhar Tokens**: Função `mint` do ERC-20 com casas decimais
- **Atualizar Preço**: Função `setPrice` do ERC-721 com validações
- **Consultar Preço**: Exibição da função `price` pública
- Controle de acesso (apenas owners)

### ✅ **Painel de Usuários** (`/users`)
- **Consulta de Preço**: Automática via função `price`
- **Processo de Compra**:
  1. Verificação de saldo suficiente
  2. Aprovação via função `approve` do ERC-20
  3. Compra via função `mint` do ERC-721
- Interface step-by-step intuitiva
- Validações em tempo real

### ✅ **Painel de Tokens** (`/tokens`)
- **Lista de NFTs**: Exibição dos NFTs do usuário
- **Transferência**: Função para transferir NFTs
- **Metadados**: Suporte a token URIs
- **Estatísticas**: Participação na coleção

## 🛠️ Tecnologias Utilizadas

- **React.js 18** - Framework principal
- **RainbowKit** - Conexão de carteiras
- **Wagmi** - Hooks para interação com blockchain
- **Viem** - Biblioteca para Ethereum
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd nft-dapp-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o servidor de desenvolvimento
npm start
```

## ⚙️ Configuração

### 1. **Variáveis de Ambiente**
```bash
# .env
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_project_id
REACT_APP_TOKEN_CONTRACT_ADDRESS=0x...
REACT_APP_NFT_CONTRACT_ADDRESS=0x...
```

### 2. **Endereços dos Contratos**
Edite `src/config/contracts.js`:
```javascript
export const CONTRACTS = {
  1337: { // Hardhat local
    TOKEN_ADDRESS: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    NFT_ADDRESS: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  // Adicione outras redes...
};
```

### 3. **Redes Suportadas**
Edite `src/config/wagmi.js` para configurar as redes desejadas.

## 🎯 Estrutura do Projeto

```
src/
├── components/
│   ├── Header.js          # Header com RainbowKit
│   ├── Navigation.js      # Navegação entre seções
│   ├── AdminPanel.js      # Painel administrativo
│   ├── UserPanel.js       # Painel de usuários
│   └── TokensPanel.js     # Painel de NFTs
├── config/
│   ├── wagmi.js          # Configuração Wagmi/RainbowKit
│   └── contracts.js      # ABIs e endereços dos contratos
├── App.js                # Aplicação principal
├── App.css              # Estilos customizados
└── index.js             # Ponto de entrada
```

## 🔧 Funcionalidades Detalhadas

### **Administração**
- [x] Cunhar tokens para qualquer endereço
- [x] Alterar preço dos NFTs
- [x] Visualizar preço atual
- [x] Controle de acesso por owner
- [x] Validação de casas decimais (18)

### **Usuários**
- [x] Verificação automática de saldo
- [x] Processo de aprovação step-by-step
- [x] Compra de NFTs com validações
- [x] Feedback visual em tempo real
- [x] Exibição de saldo no header

### **Tokens/NFTs**
- [x] Lista de NFTs do usuário
- [x] Transferência para outras carteiras
- [x] Visualização de metadados
- [x] Estatísticas da coleção
- [x] Interface responsiva

## 🎨 Design e UX

### **Características**
- ✅ Design moderno e responsivo
- ✅ Tema claro com suporte a dark mode
- ✅ Animações suaves
- ✅ Feedback visual para todas as ações
- ✅ Estados de loading
- ✅ Tratamento de erros

### **Paleta de Cores**
- **Primária**: Azul (#3b82f6)
- **Sucesso**: Verde (#10b981)
- **Aviso**: Amarelo (#f59e0b)
- **Erro**: Vermelho (#ef4444)

## 🔍 Validações Implementadas

### **Administração**
- Verificação de ownership dos contratos
- Validação de endereços
- Validação de valores numéricos
- Tratamento de casas decimais

### **Usuários**
- Verificação de saldo suficiente
- Validação de aprovação
- Verificação de conexão da carteira
- Estados de transação

### **Transferências**
- Validação de posse do NFT
- Verificação de endereço de destino
- Confirmação de transação

## 📱 Responsividade

- ✅ **Mobile First**: Design otimizado para mobile
- ✅ **Tablet**: Adaptação para tablets
- ✅ **Desktop**: Layout expandido para telas grandes
- ✅ **Navegação**: Menu adaptativo por tamanho de tela

## 🚦 Estados da Aplicação

### **Conexão**
- Desconectado: Prompt para conectar
- Conectando: Loading state
- Conectado: Interface completa

### **Transações**
- Idle: Estado inicial
- Pending: Aguardando confirmação
- Success: Transação confirmada
- Error: Erro na transação

## 🔒 Segurança

- ✅ Validação de endereços
- ✅ Verificação de ownership
- ✅ Sanitização de inputs
- ✅ Tratamento de erros
- ✅ Timeouts de transação

## 📊 Performance

- ✅ Lazy loading de componentes
- ✅ Otimização de re-renders
- ✅ Cache de dados do blockchain
- ✅ Compressão de assets

## 🧪 Testes (Opcional)

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage
```

## 🚀 Deploy

### **Build de Produção**
```bash
npm run build
```

### **Deploy Options**
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **IPFS**: Para descentralização completa

## 🔧 Troubleshooting

### **Problemas Comuns**

1. **Carteira não conecta**
   - Verifique se tem MetaMask instalado
   - Confirme a rede correta
   - Verifique o WALLET_CONNECT_PROJECT_ID

2. **Contratos não encontrados**
   - Confirme os endereços em `contracts.js`
   - Verifique se está na rede correta
   - Confirme que os contratos foram deployados

3. **Transações falham**
   - Verifique saldo de gas
   - Confirme aprovações
   - Verifique se os contratos estão funcionando

### **Debug**
```bash
# Logs detalhados
npm start -- --verbose

# Modo de desenvolvimento com hot reload
npm run dev
```

## 📈 Próximas Melhorias

- [ ] Suporte a múltiplas moedas
- [ ] Sistema de favoritos
- [ ] Marketplace integrado
- [ ] Notificações push
- [ ] Histórico de transações
- [ ] Integração com The Graph
- [ ] Suporte offline

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

**✅ Frontend Completo**: Todas as funcionalidades solicitadas foram implementadas com design moderno, validações robustas e excelente UX!
