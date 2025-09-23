# Alterações no Sistema ColeteCare

## Resumo das Alterações

O sistema foi modificado para que o colete funcione de forma independente, sem conexão Bluetooth. Agora cada colete possui um código único que é vinculado ao idoso, e as quedas são salvas diretamente no banco de dados pelo próprio colete.

## Principais Mudanças

### 1. Tela ConectarColeteCare
- **Arquivo**: `src/ConectarColeteCare/index.js`
- **Alterações**:
  - Removida funcionalidade Bluetooth
  - Adicionado campo de entrada para código do colete
  - Interface atualizada com instruções sobre como encontrar o código
  - Validação e vinculação do colete via API

### 2. Novos Endpoints da API

#### `vincularColete.php`
- **Função**: Vincular um colete a um idoso usando o código único
- **Método**: POST
- **Parâmetros**:
  - `codigoColete`: Código único do colete (ex: COL001234)
  - `idosoId`: ID do idoso
- **Retorno**: Status da vinculação e informações do colete

#### `salvarQueda.php`
- **Função**: Endpoint para o colete salvar quedas detectadas
- **Método**: POST
- **Parâmetros**:
  - `codigoColete`: Código do colete que detectou a queda
  - `intensidade`: Intensidade da queda (opcional)
  - `latitude`: Latitude da queda (opcional)
  - `longitude`: Longitude da queda (opcional)
  - `timestamp`: Data/hora da queda
- **Funcionalidades**:
  - Salva a queda na tabela `quedas`
  - Cria automaticamente um alerta na tabela `alertas`
  - Envia notificação push para cuidadores

#### `getQuedas.php`
- **Função**: Buscar quedas de um idoso ou família
- **Método**: POST
- **Parâmetros**:
  - `familiaId`: ID da família
  - `idosoId`: ID do idoso (opcional)
  - `limite`: Limite de resultados (padrão: 50)
- **Retorno**: Lista de quedas com informações detalhadas

#### `getColeteInfo.php`
- **Função**: Buscar informações do colete vinculado a um idoso
- **Método**: POST
- **Parâmetros**:
  - `idosoId`: ID do idoso
- **Retorno**: Informações do colete e estatísticas de quedas

### 3. Novas Tabelas do Banco de Dados

#### Tabela `coletes`
```sql
CREATE TABLE coletes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    idosoId INT,
    dataVinculacao DATETIME,
    ativo TINYINT(1) DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Tabela `quedas`
```sql
CREATE TABLE quedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idosoId INT NOT NULL,
    codigoColete VARCHAR(50),
    intensidade DECIMAL(5,2),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    dataQueda DATETIME NOT NULL,
    status ENUM('detectada', 'confirmada', 'falso_positivo', 'resolvida') DEFAULT 'detectada',
    observacoes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Alterações nos Endpoints Existentes

#### `getAlertasTempoReal.php`
- Adicionado LEFT JOIN com tabela `quedas`
- Incluídas informações de quedas nos alertas retornados
- Campos adicionais: `quedaIntensidade`, `quedaLatitude`, `quedaLongitude`, `dataQueda`, `codigoColete`

#### `listarAlertas.php`
- Adicionado LEFT JOIN com tabela `quedas`
- Incluídas informações de quedas nos alertas retornados
- Campos adicionais: `quedaIntensidade`, `quedaLatitude`, `quedaLongitude`, `dataQueda`, `codigoColete`, `statusQueda`

## Como Usar o Novo Sistema

### 1. Vincular Colete
1. O idoso acessa a tela "Conectar ColeteCare"
2. Digita o código do colete (formato: COL + números)
3. Sistema valida e vincula o colete ao idoso

### 2. Detecção de Quedas
1. O colete detecta uma queda
2. Colete faz uma requisição POST para `salvarQueda.php`
3. Sistema salva a queda e cria um alerta automaticamente
4. Cuidadores recebem notificação push

### 3. Monitoramento
- Cuidadores podem visualizar quedas através dos alertas
- Sistema mantém histórico completo de quedas
- Estatísticas disponíveis por idoso e família

## Códigos dos Coletes

- **Formato**: COL + números (ex: COL001234, COL000001)
- **Localização**: Impresso na etiqueta do colete e no manual
- **Unicidade**: Cada código é único e vinculado a apenas um idoso

## Instalação

1. Execute o script SQL `create_coletes_tables.sql` no banco de dados
2. Os endpoints já estão prontos para uso
3. A tela do app já foi atualizada

## Benefícios da Nova Implementação

1. **Independência**: Colete não depende de conexão Bluetooth
2. **Confiabilidade**: Dados salvos diretamente no banco
3. **Rastreabilidade**: Histórico completo de quedas
4. **Escalabilidade**: Sistema suporta múltiplos coletes
5. **Facilidade**: Vinculação simples por código
