# FamilyCare

FamilyCare é um aplicativo completo para auxiliar famílias e cuidadores no acompanhamento da saúde e bem-estar de idosos. O sistema integra aplicativo mobile, APIs e recursos de hardware (Arduino/ColeteCare), promovendo segurança, comunicação e organização no cuidado diário.

---

## 📋 Sumário
- [Visão Geral](#visão-geral)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Tutorial do Usuário](#tutorial-do-usuário)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Visão Geral
O FamilyCare foi desenvolvido para facilitar o acompanhamento de idosos por familiares e cuidadores, centralizando informações de saúde, alertas, medicamentos, solicitações e integração com dispositivos de monitoramento.

## Funcionalidades Principais
- Cadastro e gerenciamento de idosos, cuidadores e famílias
- Envio e recebimento de alertas de emergência (SOS)
- Controle e lembrete de medicação
- Histórico de saúde e condições médicas
- Solicitações e convites para famílias
- Integração com hardware (Arduino/ColeteCare)
- Interface intuitiva e responsiva para mobile

## Estrutura do Projeto
```
familyCare/
├── Arduino/                # Códigos para integração com hardware
├── BD/                     # Banco de dados e modelos conceituais/lógicos
├── Mobile/
│   └── appFamilyCare/
│       ├── apireact/       # APIs em PHP para backend mobile
│       ├── src/            # Código-fonte React Native (componentes, serviços, contexto)
│       └── assets/         # Imagens e ícones
├── Web/                    # Interface web e arquivos estáticos
└── README.md               # Este arquivo
```

## Como Executar
### Pré-requisitos
- Node.js (>= 14)
- npm ou yarn
- PHP (para APIs)
- Banco de dados MySQL
- (Opcional) Arduino IDE para integração com hardware

### Instalação e Execução
1. **Clone o repositório:**
   ```bash
   git clone <repo-url>
   cd familyCare/Mobile/appFamilyCare
   ```
2. **Instale as dependências do app mobile:**
   ```bash
   npm install
   # ou
   yarn install
   ```
3. **Configure as variáveis de ambiente e URLs da API** em `src/services/url.js`.
4. **Inicie o app mobile:**
   ```bash
   npx expo start
   ```
5. **Configure e rode o backend PHP** (diretório `apireact/`) em um servidor local (ex: XAMPP, WAMP, Laragon).
6. **Importe o banco de dados** usando o arquivo `BD/bd_familyCare.sql`.
7. **(Opcional) Programe o Arduino** com os códigos em `Arduino/` para integração com o ColeteCare.

## Tutorial do Usuário
### 1. Cadastro e Login
- Abra o app e cadastre-se como cuidador ou idoso.
- Faça login com seu e-mail e senha.

### 2. Gerenciamento de Famílias
- Crie ou entre em uma família usando um código.
- Convide outros cuidadores para sua família.

### 3. Cadastro de Idosos
- Adicione informações do idoso, condições médicas e responsável principal.

### 4. Alertas e SOS
- Idosos podem enviar alertas de emergência (SOS) para cuidadores.
- Cuidadores recebem notificações em tempo real.

### 5. Medicação e Histórico
- Cadastre/remova medicamentos e horários.
- Visualize histórico de saúde e condições médicas.

### 6. Integração com ColeteCare
- Siga as instruções na tela para conectar o dispositivo via Bluetooth.

### 7. Segurança e Privacidade
- Nenhum dado sensível é exposto em mensagens ou logs.
- Todas as ações críticas pedem confirmação.

## Contribuição
Contribuições são bem-vindas! Siga o padrão do projeto e registre alterações relevantes.

## Licença
Este projeto está sob a licença MIT.
