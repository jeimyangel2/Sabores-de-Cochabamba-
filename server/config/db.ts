import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración cargada estrictamente desde variables de entorno
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sabores_cochabamba',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 4000 // 4s timeout para verificar disponibilidad
};

let pool: mysql.Pool | null = null;
let isMySqlConnected = false;
let lastConnectionAttemptError: string | null = null;

/**
 * Inicializa el pool de conexiones MySQL 8.x
 */
export async function initializeDatabasePool(): Promise<boolean> {
  try {
    pool = mysql.createPool(dbConfig);
    // Verificar conexión de prueba
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isMySqlConnected = true;
    lastConnectionAttemptError = null;
    console.log(`[MySQL 8.x] Conectado exitosamente a la base de datos '${dbConfig.database}' en ${dbConfig.host}:${dbConfig.port}`);
    return true;
  } catch (error: any) {
    isMySqlConnected = false;
    lastConnectionAttemptError = error?.message || 'Error de conexión a MySQL local';
    console.warn(`[MySQL 8.x Info] No se pudo establecer conexión inmediata con MySQL local (${dbConfig.host}:${dbConfig.port}): ${lastConnectionAttemptError}`);
    console.warn(`[MySQL 8.x Info] La aplicación utilizará el modo de datos preparado en memoria hasta que el servicio local de MySQL esté disponible.`);
    return false;
  }
}

/**
 * Obtiene el pool activo o null
 */
export function getPool(): mysql.Pool | null {
  return pool;
}

/**
 * Estado actual de la conexión a MySQL
 */
export function getDatabaseStatus() {
  return {
    connected: isMySqlConnected,
    provider: isMySqlConnected ? ('mysql' as const) : ('mock_fallback' as const),
    message: isMySqlConnected
      ? 'Conectado a MySQL 8.x Local'
      : 'Modo datos locales preparado (Esperando conexión a MySQL local)',
    database: dbConfig.database,
    host: `${dbConfig.host}:${dbConfig.port}`,
    user: dbConfig.user,
    lastError: lastConnectionAttemptError,
    timestamp: new Date().toISOString()
  };
}

/**
 * Ejecuta una consulta SQL en MySQL si está disponible
 */
export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[] | null> {
  if (!isMySqlConnected || !pool) {
    return null;
  }
  try {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  } catch (err) {
    console.error('[MySQL Query Error]:', err);
    throw err;
  }
}
