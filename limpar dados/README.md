# FamilyCare - Sistema de Limpeza de Dados

Sistema web desenvolvido em Flask para gerenciamento e limpeza de dados do banco FamilyCare durante demonstrações em feiras.

## 🚀 Funcionalidades

### Seção Principal
- **Limpar Alertas**: Remove todos os alertas e suas respostas
- **Limpar Recados**: Remove todos os recados do sistema
- **Reset Padrão**: Remove alertas, recados e solicitações, mantendo dados principais
- **Reset Completo**: Remove todos os dados e recria o banco com dados fake

### Seção de Controles Avançados
- **Gerenciamento Individual de Tabelas**: Limpeza específica de cada tabela
- **Condições WHERE**: Filtros personalizados para exclusão de dados
- **Controle do Banco**: Criar, recriar e remover banco de dados
- **SQL Customizado**: Execução de queries SELECT personalizadas

## 📋 Pré-requisitos

- Python 3.7+
- MySQL/MariaDB
- Flask
- mysql-connector-python

## 🛠️ Instalação

1. **Instalar dependências**:
```bash
pip install flask mysql-connector-python
```

2. **Configurar banco de dados**:
   - Edite o arquivo `app.py` na seção `DB_CONFIG`
   - Configure host, usuário, senha conforme seu ambiente

3. **Executar aplicação**:
```bash
python app.py
```

4. **Acessar sistema**:
   - **Local**: `http://127.0.0.1:5002`
   - **Rede**: `http://[SEU_IP]:5002` (para acesso via celular)
   - **Descobrir IP**: Execute `ipconfig` no Windows

## 🎨 Identidade Visual

O sistema mantém a identidade visual do FamilyCare:
- Cores: Azul primário (#2E86C1), Verde secundário (#27AE60)
- Tipografia: Inter e Poppins
- Design responsivo e moderno
- Animações suaves e feedback visual

## 📊 Estrutura do Banco

O sistema trabalha com as seguintes tabelas:
- `usuarios` - Cuidadores
- `idosos` - Idosos cadastrados
- `familias` - Famílias
- `alertas` - Alertas do sistema
- `recados` - Mensagens entre usuários
- `remedios` - Medicamentos
- `dispositivos` - Dispositivos IoT
- `solicitacoes_familia` - Convites para famílias

## 🔧 Configuração

### Configuração do Banco de Dados
```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Sua senha do MySQL
    'database': 'familycare',
    'charset': 'utf8mb4'
}
```

### Porta do Servidor
Por padrão, a aplicação roda na porta 5002. Para alterar:
```python
app.run(host='127.0.0.1', port=5002, debug=True)
```

## 🚨 Segurança

- Validação de condições WHERE para prevenir SQL injection
- Apenas queries SELECT permitidas no SQL customizado
- Confirmações para operações destrutivas
- Logs de operações realizadas

## 📱 Responsividade Mobile

O sistema é **otimizado para celular** e totalmente responsivo:

### 🎯 Mobile First Design
- ✅ Interface adaptada para telas pequenas
- ✅ Botões grandes e fáceis de tocar
- ✅ Navegação simplificada
- ✅ Modais otimizados para mobile
- ✅ Flash messages responsivas

### 📱 Breakpoints
- **Desktop**: > 768px
- **Tablet**: 576px - 768px  
- **Mobile**: < 576px
- **Mobile Small**: < 480px

### 🔧 Melhorias Mobile
- Viewport otimizado
- Touch-friendly buttons
- Scroll suave
- Animações reduzidas para performance
- Texto legível em telas pequenas

## 🎯 Uso em Feiras

### Operações Rápidas
1. **Durante demonstrações**: Use "Limpar Alertas" e "Limpar Recados"
2. **Entre demonstrações**: Use "Reset Padrão"
3. **Fim do dia**: Use "Reset Completo"

### Controles Avançados
- Acesse "Controles Avançados" para operações específicas
- Use condições WHERE para limpeza seletiva
- Execute SQL customizado para consultas específicas

## 🔍 Monitoramento

O sistema exibe:
- Contadores de registros em tempo real
- Feedback visual de operações
- Mensagens de sucesso/erro
- Logs de performance

## 🛡️ Backup

**IMPORTANTE**: Sempre faça backup antes de operações destrutivas:
- O "Reset Completo" remove TODOS os dados
- Use com cuidado em ambiente de produção

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs do console
- Confirme a configuração do banco
- Teste a conectividade com MySQL

## 🎨 Personalização

Para personalizar a aparência:
- Edite `static/css/style.css`
- Modifique as variáveis CSS no início do arquivo
- Ajuste cores, fontes e espaçamentos

---

**FamilyCare** - Tecnologia que Cuida 💙
