/**
 * Script auxiliar para facilitar la traducción de comandos
 * Este archivo contiene funciones helper para implementar traducciones de manera consistente
 */

const fs = require('fs');
const path = require('path');

/**
 * Función para buscar y listar todos los archivos de comandos
 */
function findCommandFiles(dir = './commands') {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

/**
 * Función para extraer strings que necesitan traducción de un archivo
 */
function extractTranslatableStrings(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const strings = [];
  
  // Patrones comunes para buscar strings traducibles
  const patterns = [
    /\.setDescription\(['"]([^'"]+)['"]\)/g,
    /\.setTitle\(['"]([^'"]+)['"]\)/g,
    /content:\s*['"]([^'"]+)['"]/g,
    /name:\s*['"]([^'"]+)['"]/g,
    /value:\s*['"]([^'"]+)['"]/g,
    /text:\s*['"]([^'"]+)['"]/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1] && !match[1].includes('${') && !match[1].includes('`')) {
        strings.push({
          text: match[1],
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }
  });
  
  return strings;
}

/**
 * Plantilla para nuevas categorías de traducción
 */
const translationTemplate = {
  newCategory: {
    description: "Descripción del comando",
    success: "Operación exitosa",
    error: "Error al ejecutar la operación",
    noPermission: "No tienes permisos para esta acción",
    userNotFound: "Usuario no encontrado",
    invalidInput: "Entrada inválida"
  }
};

/**
 * Función para generar código de traducción
 */
function generateTranslationCode(commandName, strings) {
  console.log(`\n=== Traduciones sugeridas para ${commandName} ===`);
  
  strings.forEach((str, index) => {
    const key = str.text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
    
    console.log(`${commandName}.${key}: "${str.text}",`);
  });
  
  console.log(`\n=== Código de implementación ===`);
  console.log(`const { t } = require('../../utils/translations');\n`);
  
  strings.forEach((str, index) => {
    const key = str.text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
    
    console.log(`// Línea ${str.line}: "${str.text}"`);
    console.log(`// Cambiar por: t('${commandName}.${key}')\n`);
  });
}

/**
 * Lista de comandos comunes y sus traducciones sugeridas
 */
const commonTranslations = {
  // Moderación
  kick: {
    description: "Expulsar un miembro del servidor",
    userKicked: "Miembro Expulsado",
    kickedBy: "Expulsado por",
    reason: "Razón"
  },
  
  timeout: {
    description: "Silenciar temporalmente a un miembro",
    userTimedOut: "Miembro Silenciado",
    timedOutBy: "Silenciado por",
    duration: "Duración"
  },
  
  // Información
  userinfo: {
    description: "Mostrar información sobre un usuario",
    userInformation: "Información del Usuario",
    accountCreated: "Cuenta creada",
    joinedServer: "Se unió al servidor"
  },
  
  serverinfo: {
    description: "Mostrar información sobre el servidor",
    serverInformation: "Información del Servidor",
    memberCount: "Miembros",
    channelCount: "Canales"
  },
  
  // Utilidades
  weather: {
    description: "Obtener información del clima",
    weatherInfo: "Información del Clima",
    temperature: "Temperatura",
    humidity: "Humedad"
  }
};

/**
 * Función principal para analizar un comando específico
 */
function analyzeCommand(commandPath) {
  const commandName = path.basename(commandPath, '.js');
  const strings = extractTranslatableStrings(commandPath);
  
  console.log(`\n📁 Analizando: ${commandPath}`);
  console.log(`🔤 Strings encontrados: ${strings.length}`);
  
  if (strings.length > 0) {
    generateTranslationCode(commandName, strings);
  }
  
  // Mostrar traducciones comunes si existen
  if (commonTranslations[commandName]) {
    console.log(`\n=== Traducciones comunes disponibles ===`);
    console.log(JSON.stringify(commonTranslations[commandName], null, 2));
  }
}

// Ejemplo de uso
if (require.main === module) {
  console.log('🔍 Sistema de Análisis de Traducciones - Lanya Bot');
  console.log('=' .repeat(50));
  
  // Listar todos los comandos
  const commandFiles = findCommandFiles();
  console.log(`\n📊 Total de comandos encontrados: ${commandFiles.length}`);
  
  // Analizar comandos específicos (descomenta para usar)
  // analyzeCommand('./commands/moderation/kick.js');
  // analyzeCommand('./commands/info/userinfo.js');
  
  console.log('\n✨ Para analizar un comando específico, usa:');
  console.log('analyzeCommand("./commands/categoria/comando.js")');
}

module.exports = {
  findCommandFiles,
  extractTranslatableStrings,
  generateTranslationCode,
  analyzeCommand,
  commonTranslations
};
