/**
 * Archivo centralizado de traducciones al español para Lanya Bot
 * Contiene todos los mensajes, errores y textos del bot traducidos
 */

const translations = {
  // ========== COMANDOS GENERALES ==========
  ping: {
    pinging: "Calculando ping...",
    pong: "🏓 ¡Pong!",
    apiPing: "📡 Ping de la API",
    clientPing: "⏱️ Ping del Cliente",
    description: "Aquí está la información de latencia del bot:",
    requestedBy: "Solicitado por"
  },

  // ========== MODERACIÓN ==========
  ban: {
    description: "Banear un miembro del servidor.",
    userNotInServer: "El usuario no está en el servidor",
    noPermission: "¡No tienes permisos de `BanMembers` para banear miembros!",
    cannotBanHigherRole: "No puedes banear a este usuario ya que tiene un rol superior o igual.",
    botCannotBanHigherRole: "No puedo banear a este usuario ya que tiene un rol superior o igual al mío.",
    invalidDuration: "¡Formato de duración inválido! Usa algo como `1d2h30m40s`.",
    memberBanned: "Miembro Baneado",
    userBannedDescription: "⛔ {user} ha sido baneado del servidor.",
    reason: "Razón",
    bannedBy: "Baneado por",
    duration: "Duración",
    permanent: "Permanente",
    noReasonProvided: "No se proporcionó razón."
  },

  kick: {
    description: "Expulsar un miembro del servidor.",
    userNotInServer: "El usuario no está en el servidor",
    noPermission: "¡No tienes permisos de `KickMembers` para expulsar miembros!",
    cannotKickHigherRole: "No puedes expulsar a este usuario ya que tiene un rol superior o igual.",
    botCannotKickHigherRole: "No puedo expulsar a este usuario ya que tiene un rol superior o igual al mío.",
    memberKicked: "Miembro Expulsado",
    userKickedDescription: "👟 {user} ha sido expulsado del servidor.",
    kickedBy: "Expulsado por"
  },

  timeout: {
    description: "Silenciar temporalmente a un miembro.",
    userNotInServer: "El usuario no está en el servidor",
    noPermission: "¡No tienes permisos de `ModerateMembers` para silenciar miembros!",
    cannotTimeoutHigherRole: "No puedes silenciar a este usuario ya que tiene un rol superior o igual.",
    botCannotTimeoutHigherRole: "No puedo silenciar a este usuario ya que tiene un rol superior o igual al mío.",
    invalidDuration: "¡Formato de duración inválido! Usa algo como `1d2h30m40s`.",
    memberTimedOut: "Miembro Silenciado",
    userTimedOutDescription: "🔇 {user} ha sido silenciado.",
    timedOutBy: "Silenciado por"
  },

  // ========== INFORMACIÓN ==========
  userinfo: {
    description: "Mostrar información sobre un usuario.",
    userInformation: "Información del Usuario",
    username: "Nombre de usuario",
    id: "ID",
    nickname: "Apodo",
    none: "Ninguno",
    accountCreated: "Cuenta creada",
    joinedServer: "Se unió al servidor",
    roles: "Roles ({count})",
    noRoles: "Sin roles",
    permissions: "Permisos clave",
    status: "Estado",
    activity: "Actividad"
  },

  serverinfo: {
    description: "Mostrar información sobre el servidor.",
    serverInformation: "Información del Servidor",
    serverName: "Nombre del servidor",
    serverOwner: "Propietario del servidor",
    serverCreated: "Servidor creado",
    memberCount: "Miembros",
    channelCount: "Canales",
    roleCount: "Roles",
    emojiCount: "Emojis",
    boostLevel: "Nivel de boost",
    boostCount: "Boosts"
  },

  botinfo: {
    description: "Mostrar información sobre el bot.",
    botInformation: "Información del Bot",
    botName: "Nombre del bot",
    developer: "Desarrollador",
    version: "Versión",
    library: "Librería",
    uptime: "Tiempo activo",
    serverCount: "Servidores",
    userCount: "Usuarios",
    commandCount: "Comandos"
  },

  // ========== UTILIDADES ==========
  weather: {
    description: "Obtener información del clima de una ciudad.",
    invalidLocation: "No se pudo encontrar información del clima para esa ubicación.",
    weatherInfo: "Información del Clima",
    temperature: "Temperatura",
    feelsLike: "Se siente como",
    humidity: "Humedad",
    windSpeed: "Velocidad del viento",
    visibility: "Visibilidad",
    pressure: "Presión",
    uvIndex: "Índice UV"
  },

  calculator: {
    description: "Realizar cálculos matemáticos.",
    invalidExpression: "Expresión matemática inválida.",
    result: "Resultado",
    calculation: "Cálculo"
  },

  translate: {
    description: "Traducir texto a otro idioma.",
    translationError: "Error al traducir el texto.",
    originalText: "Texto original",
    translatedText: "Texto traducido",
    detectedLanguage: "Idioma detectado",
    targetLanguage: "Idioma objetivo"
  },

  // ========== DIVERSIÓN ==========
  dice: {
    description: "Lanzar un dado de 6 caras.",
    result: "🎲 ¡Obtuviste un {number}!"
  },

  coinflip: {
    description: "Lanzar una moneda.",
    heads: "🪙 ¡Cara!",
    tails: "🪙 ¡Cruz!"
  },

  joke: {
    description: "Obtener un chiste aleatorio.",
    errorFetching: "Error al obtener el chiste."
  },

  // ========== TICKETS ==========
  tickets: {
    ticketCreated: "Ticket creado exitosamente",
    ticketClosed: "🔒 Cerrando ticket en 5 segundos...",
    ticketClosedTitle: "Ticket Cerrado",
    ticketTransferred: "Ticket transferido exitosamente",
    userBannedFromTickets: "Usuario baneado de los tickets",
    userUnbannedFromTickets: "Usuario desbaneado de los tickets",
    userAddedToTicket: "Usuario agregado al ticket",
    userRemovedFromTicket: "Usuario removido del ticket",
    noPermissionTickets: "No tienes permisos para gestionar tickets",
    ticketNotFound: "Este no es un canal de ticket válido",
    alreadyBanned: "Este usuario ya está baneado de los tickets",
    notBanned: "Este usuario no está baneado de los tickets"
  },

  // ========== GIVEAWAYS ==========
  giveaways: {
    giveawayStarted: "🎉 ¡Sorteo iniciado!",
    giveawayEnded: "🎉 ¡Sorteo finalizado!",
    giveawayCancelled: "❌ Sorteo cancelado",
    giveawayRerolled: "🔄 Sorteo re-sorteado",
    noWinners: "No hay ganadores válidos",
    congratulations: "¡Felicidades!",
    winner: "Ganador",
    winners: "Ganadores",
    endTime: "Finaliza",
    prize: "Premio",
    hostedBy: "Organizado por",
    requirements: "Requisitos",
    entries: "Participaciones"
  },

  // ========== MÚSICA (Solo errores y mensajes del sistema) ==========
  music: {
    notInVoiceChannel: "¡Necesitas estar en un canal de voz para usar este comando!",
    sameVoiceChannel: "¡Necesitas estar en el mismo canal de voz que el bot!",
    noPermissionConnect: "No tengo permisos para conectarme a tu canal de voz",
    noPermissionSpeak: "No tengo permisos para hablar en tu canal de voz",
    queueEmpty: "La cola está vacía",
    nothingPlaying: "No se está reproduciendo nada actualmente",
    trackNotFound: "No se pudo encontrar la pista",
    searchError: "Error al buscar música",
    playerError: "Error del reproductor",
    loadFailed: "Error al cargar la pista"
  },

  // ========== NIVELES ==========
  levels: {
    leaderboard: "Tabla de Clasificación",
    level: "Nivel",
    experience: "Experiencia",
    rank: "Rango",
    totalXP: "XP Total",
    noData: "No hay datos de niveles disponibles",
    levelUp: "¡Subiste de nivel!",
    newLevel: "¡Ahora eres nivel {level}!"
  },

  // ========== MINECRAFT ==========
  minecraft: {
    serverStatus: "Estado del Servidor",
    online: "🟢 En línea",
    offline: "🔴 Fuera de línea",
    players: "Jugadores",
    version: "Versión",
    motd: "MOTD",
    ping: "Ping",
    invalidServer: "Servidor de Minecraft inválido",
    skinViewer: "Visualizador de Skin",
    playerNotFound: "Jugador no encontrado"
  },

  // ========== WELCOME ==========
  welcome: {
    welcomeMessage: "¡Bienvenido {member} a {server}!",
    memberJoined: "{member} se ha unido al servidor",
    memberLeft: "{member} ha dejado el servidor",
    rulesChannel: "canal de reglas",
    generalChannel: "canal general"
  },

  // ========== ERRORES GENERALES ==========
  errors: {
    noPermission: "No tienes permisos para usar este comando",
    botNoPermission: "No tengo los permisos necesarios para ejecutar este comando",
    userNotFound: "Usuario no encontrado",
    channelNotFound: "Canal no encontrado",
    roleNotFound: "Rol no encontrado",
    serverError: "Error interno del servidor",
    commandCooldown: "Este comando está en tiempo de espera. Inténtalo de nuevo en {time}",
    invalidArguments: "Argumentos inválidos proporcionados",
    databaseError: "Error de base de datos",
    apiError: "Error de API externa",
    unknown: "Error desconocido"
  },

  // ========== MENSAJES DE ÉXITO ==========
  success: {
    commandExecuted: "Comando ejecutado exitosamente",
    settingsUpdated: "Configuración actualizada",
    dataSaved: "Datos guardados correctamente",
    actionCompleted: "Acción completada"
  },

  // ========== ADMINISTRACIÓN ==========
  admin: {
    settingsUpdated: "Configuración del servidor actualizada",
    featureEnabled: "Función habilitada",
    featureDisabled: "Función deshabilitada",
    configReset: "Configuración restablecida a valores predeterminados",
    backupCreated: "Copia de seguridad creada",
    dataImported: "Datos importados exitosamente"
  },

  // ========== TIEMPO Y FECHAS ==========
  time: {
    second: "segundo",
    seconds: "segundos",
    minute: "minuto", 
    minutes: "minutos",
    hour: "hora",
    hours: "horas",
    day: "día",
    days: "días",
    week: "semana",
    weeks: "semanas",
    month: "mes",
    months: "meses",
    year: "año",
    years: "años",
    ago: "hace",
    in: "en"
  },

  // ========== ESTADOS ==========
  status: {
    online: "En línea",
    idle: "Ausente",
    dnd: "No molestar",
    offline: "Desconectado",
    invisible: "Invisible"
  }
};

/**
 * Función helper para obtener un mensaje traducido
 * @param {string} path - Ruta del mensaje (ej: "ping.pong")
 * @param {Object} params - Parámetros para reemplazar en el mensaje
 * @returns {string} Mensaje traducido
 */
function t(path, params = {}) {
  const keys = path.split('.');
  let message = translations;
  
  for (const key of keys) {
    if (message[key] !== undefined) {
      message = message[key];
    } else {
      console.warn(`Translation key not found: ${path}`);
      return path; // Retorna la clave si no encuentra la traducción
    }
  }
  
  // Reemplazar parámetros en el mensaje
  if (typeof message === 'string' && Object.keys(params).length > 0) {
    for (const [key, value] of Object.entries(params)) {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value);
    }
  }
  
  return message;
}

module.exports = { translations, t };
