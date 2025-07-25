# Sistema de Traducciones - Lanya Bot

## Descripción

Este documento explica cómo utilizar el sistema de traducciones centralizado implementado para el bot Lanya. El sistema permite mantener todas las traducciones en un solo lugar para facilitar el mantenimiento y la consistencia.

## Estructura del Sistema

### Archivo Principal: `utils/translations.js`

Este archivo contiene:
- **translations**: Objeto con todas las traducciones organizadas por categorías
- **t()**: Función helper para obtener traducciones con parámetros

### Ejemplo de Uso

```javascript
const { t } = require('../../utils/translations');

// Uso básico
const message = t('ping.pong'); // "🏓 ¡Pong!"

// Con parámetros
const message = t('ban.userBannedDescription', { user: 'Usuario123' });
// "⛔ Usuario123 ha sido baneado del servidor."
```

## Categorías de Traducciones

### 1. Comandos Generales
- `ping.*` - Comando ping
- `userinfo.*` - Información de usuario
- `serverinfo.*` - Información del servidor
- `botinfo.*` - Información del bot

### 2. Moderación
- `ban.*` - Comando ban
- `kick.*` - Comando kick
- `timeout.*` - Comando timeout

### 3. Música
- `music.*` - Mensajes del sistema de música (solo errores)

### 4. Utilidades
- `weather.*` - Comando del clima
- `calculator.*` - Calculadora
- `translate.*` - Traductor

### 5. Diversión
- `dice.*` - Lanzar dados
- `coinflip.*` - Lanzar moneda
- `joke.*` - Chistes

### 6. Tickets
- `tickets.*` - Sistema de tickets

### 7. Giveaways
- `giveaways.*` - Sistema de sorteos

### 8. Niveles
- `levels.*` - Sistema de niveles

### 9. Minecraft
- `minecraft.*` - Comandos de Minecraft

### 10. Errores y Estados
- `errors.*` - Mensajes de error generales
- `success.*` - Mensajes de éxito
- `status.*` - Estados de usuario

## Comandos con Traducción Directa

Los siguientes comandos tienen sus traducciones directamente en el archivo para preservar el diseño:

### `/play` - Comando de Música
- Traducciones aplicadas directamente en `commands/music/play.js`
- Incluye mensajes de búsqueda, autocompletado y embeds

### `/help` - Comando de Ayuda
- Traducciones aplicadas directamente en `commands/info/help.js`
- Incluye categorías, mensajes de error y navegación

## Implementación en Comandos

### Ejemplo 1: Comando Ping
```javascript
const { t } = require('../../utils/translations');

// En lugar de:
.setTitle('🏓 Pong!')

// Usar:
.setTitle(t('ping.pong'))
```

### Ejemplo 2: Comando Ban con Parámetros
```javascript
const { t } = require('../../utils/translations');

// En lugar de:
.setDescription(`⛔ ${user.tag} has been banned from the server.`)

// Usar:
.setDescription(t('ban.userBannedDescription', { user: user.tag }))
```

### Ejemplo 3: Mensajes de Error
```javascript
const { t } = require('../../utils/translations');

// En lugar de:
return interaction.reply({
  content: 'You do not have permission!',
  ephemeral: true,
});

// Usar:
return interaction.reply({
  content: t('ban.noPermission'),
  ephemeral: true,
});
```

## Agregar Nuevas Traducciones

Para agregar una nueva traducción:

1. Abrir `utils/translations.js`
2. Agregar la nueva clave en la categoría apropiada:

```javascript
newCommand: {
  description: "Descripción del nuevo comando",
  success: "¡Comando ejecutado exitosamente!",
  error: "Error al ejecutar el comando"
}
```

3. Usar en el comando:
```javascript
const { t } = require('../../utils/translations');
const message = t('newCommand.success');
```

## Comandos Ya Traducidos

### ✅ Completamente Traducidos
- **ping.js** - Sistema de traducciones + traducción directa
- **ban.js** - Sistema de traducciones
- **play.js** - Traducción directa (preserva diseño)
- **help.js** - Traducción directa (preserva diseño)
- **closeTicket.js** - Sistema de traducciones (parcial)

### 🔄 Pendientes de Traducir
- Comandos de moderación restantes (kick, timeout, etc.)
- Comandos de información (userinfo, serverinfo, etc.)
- Comandos de utilidades
- Comandos de diversión
- Sistema de niveles
- Comandos de Minecraft
- Eventos del bot

## Beneficios del Sistema

1. **Centralización**: Todas las traducciones en un solo lugar
2. **Mantenimiento**: Fácil actualización de textos
3. **Consistencia**: Términos uniformes en todo el bot
4. **Flexibilidad**: Soporte para parámetros dinámicos
5. **Escalabilidad**: Fácil agregar nuevos idiomas en el futuro

## Próximos Pasos

1. Traducir todos los comandos restantes
2. Traducir eventos del bot
3. Traducir mensajes de error del sistema
4. Revisar y optimizar traducciones existentes
5. Agregar soporte para múltiples idiomas (opcional)

## Notas Importantes

- Los comandos `/play` y `/help` mantienen sus traducciones directas para preservar el diseño original
- El sistema de traducciones es compatible con parámetros dinámicos usando `{variable}`
- Todas las rutas de traducción usan notación de punto (ej: `ping.pong`)
- Se recomienda usar nombres descriptivos para las claves de traducción
