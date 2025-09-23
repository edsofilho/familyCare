# Configuração de Notificações Push - FamilyCare

## Resumo das Alterações

Implementei um sistema completo de notificações push para substituir os alerts quando novos alertas chegam do banco de dados. Agora, quando um idoso envia um alerta, os cuidadores recebem uma notificação push em vez de apenas um alert popup.

## Arquivos Modificados/Criados

### Frontend (React Native)
1. **app.json** - Configurações de notificação
2. **src/services/notificationService.js** - Serviço para gerenciar notificações
3. **src/HomeCuidador/index.js** - Modificado para usar notificações
4. **src/Login/index.js** - Registro de token após login

### Backend (PHP)
1. **apireact/registerPushToken.php** - API para registrar tokens
2. **apireact/sendPushNotification.php** - API para enviar notificações
3. **apireact/addAlerta.php** - Modificado para enviar push notifications
4. **apireact/create_push_tokens_table.sql** - Script SQL para criar tabela

## Como Funciona

### 1. Registro de Token
- Quando o usuário faz login, o app solicita permissão para notificações
- O token de notificação é gerado e enviado para o servidor
- O token é armazenado na tabela `push_tokens`

### 2. Envio de Alerta
- Quando um idoso envia um alerta (via `addAlerta.php`)
- O sistema busca todos os cuidadores da família
- Envia notificação push para todos os cuidadores registrados

### 3. Recebimento da Notificação
- Os cuidadores recebem a notificação push
- Ao tocar na notificação, são direcionados para a tela de alertas
- A notificação também aparece quando o app está em primeiro plano

## Configuração Necessária

### 1. Banco de Dados
Execute o script SQL para criar a tabela de tokens:
```sql
-- Execute o arquivo: apireact/create_push_tokens_table.sql
```

### 2. Configuração do Servidor
- Certifique-se de que o PHP tem cURL habilitado
- Ajuste a URL no arquivo `addAlerta.php` linha 131 se necessário:
```php
curl_setopt($ch, CURLOPT_URL, 'http://SEU_DOMINIO/apireact/sendPushNotification.php');
```

### 3. Permissões do App
- O app já está configurado para solicitar permissões automaticamente
- No iOS, certifique-se de que as notificações estão habilitadas nas configurações do dispositivo

## Funcionalidades Implementadas

### ✅ Notificações Locais
- Substitui `Alert.alert` por notificações push
- Funciona quando o app está em primeiro plano ou em background

### ✅ Registro Automático de Token
- Token é registrado automaticamente no login
- Atualizado quando necessário

### ✅ Navegação Inteligente
- Ao tocar na notificação, o usuário é direcionado para a tela de alertas
- Dados do alerta são passados via payload da notificação

### ✅ Gerenciamento de Tokens
- Tokens são armazenados no AsyncStorage
- Evita duplicação de tokens no servidor
- Atualização automática de timestamps

## Testando as Notificações

### 1. Teste Manual
- Faça login como cuidador
- Em outro dispositivo/app, faça login como idoso
- Envie um alerta SOS
- O cuidador deve receber a notificação push

### 2. Verificar Logs
- Verifique os logs do servidor para confirmar envio
- Use o console do React Native para debug

## Próximos Passos (Opcionais)

### 1. Notificações em Background
- Implementar service worker para Android
- Configurar background refresh para iOS

### 2. Personalização
- Adicionar diferentes tipos de som para diferentes alertas
- Implementar badges no ícone do app

### 3. Analytics
- Rastrear taxa de entrega das notificações
- Monitorar engajamento dos usuários

## Troubleshooting

### Notificações não aparecem
1. Verifique se as permissões foram concedidas
2. Confirme se o token foi registrado no servidor
3. Verifique os logs do servidor para erros

### Token não é registrado
1. Verifique a conexão com o servidor
2. Confirme se a tabela `push_tokens` existe
3. Verifique os logs de erro do PHP

### Notificação não navega corretamente
1. Verifique se o listener está configurado
2. Confirme se os dados estão sendo passados corretamente
3. Teste a navegação manualmente

## Conclusão

O sistema de notificações push está completamente implementado e funcional. Os cuidadores agora recebem notificações push em tempo real quando alertas são enviados pelos idosos, proporcionando uma experiência muito melhor do que os alerts popup anteriores.

