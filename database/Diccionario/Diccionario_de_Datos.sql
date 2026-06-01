USE PROYECTO;
GO

-- ==========================================
-- DOCUMENTACIÓN DE TABLAS (DESCRIPCIONES)
-- ==========================================

-- TABLA: PREMIO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Catálogo oficial de premios físicos o digitales disponibles para los jugadores.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'PREMIO';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Puntos mínimos acumulados requeridos para poder reclamar el premio.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'PREMIO',
    @level2type = N'COLUMN', @level2name = 'COSTO_PUNTOS';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Cantidad de unidades disponibles en almacén. Si es NULL significa que es ilimitado.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'PREMIO',
    @level2type = N'COLUMN', @level2name = 'STOCK';

-- TABLA: CANJE
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Registro histórico de solicitudes de premios realizadas por los usuarios.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'CANJE';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Estado transaccional del reclamo (PENDIENTE, ENTREGADO, RECHAZADO).',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'CANJE',
    @level2type = N'COLUMN', @level2name = 'ESTADO';

-- TABLA: PRONOSTICO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Predicción de marcador deportivo guardada por el usuario antes de iniciar el juego.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'PRONOSTICO';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Goles o puntos proyectados por el jugador para el equipo local.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'PRONOSTICO',
    @level2type = N'COLUMN', @level2name = 'PTS_LOCAL';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Goles o puntos proyectados por el jugador para el equipo visitante.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'PRONOSTICO',
    @level2type = N'COLUMN', @level2name = 'PTS_VISITANTE';

-- TABLA: USUARIO_APUESTA
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Tabla intermedia para controlar la participación activa y el total de puntos acumulados por usuario.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'USUARIO_APUESTA';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Suma acumulada de puntos que el usuario ha ganado en esta quiniela en específico.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'USUARIO_APUESTA',
    @level2type = N'COLUMN', @level2name = 'PUNTOS';

-- TABLA: HISTORIAL_PUNTOS
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Auditoría detallada de cada movimiento, suma o resta de puntos tras evaluar un pronóstico.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'HISTORIAL_PUNTOS';

-- TABLA: APUESTA
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Torneo o quiniela general que agrupa múltiples partidos y eventos bajo reglas específicas.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'APUESTA';

-- TABLA: EVENTO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Partido o encuentro deportivo individual asociado a una quiniela general.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'EVENTO';

-- TABLA: EVENTO_RESULTADO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Marcador oficial final ingresado por el administrador para procesar los aciertos.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'EVENTO_RESULTADO';

-- TABLA: TIPO_PUNTUACION
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Configuración de puntuaciones, multiplicadores y penalizaciones del sistema de juego.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'TIPO_PUNTUACION';

-- TABLA: PERSONA
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Datos personales base de los individuos del sistema.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'PERSONA';

-- TABLA: USUARIO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Credenciales de acceso, correos electrónicos y usernames del sistema de quinielas.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'USUARIO';

-- TABLA: ESTADO_USUARIO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Historial del rol y estado de admisión del usuario (ADMIN, JUGADOR).',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'ESTADO_USUARIO';

-- TABLA: EQUIPO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Clubes o entidades deportivas registradas en el sistema.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'EQUIPO';
GO

USE PROYECTO;
GO

-- SCRIPT EXTRACTOR INDEPENDIENTE POR TABLA (DICCIONARIO DE DATOS)

-- 1. TABLA: PERSONA
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Datos personales de usuarios y atletas.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'PERSONA';

-- 2. TABLA: USUARIO
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Credenciales de acceso y seguridad de la cuenta.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'USUARIO';

-- 3. TABLA: ESTADO_USUARIO
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Historial de roles (ADMIN/JUGADOR) y admisión del usuario.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'ESTADO_USUARIO';

-- 4. TABLA: PAIS
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'País de origen para equipos y torneos.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'PAIS';

-- 5. TABLA: EQUIPO
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Clubes o agrupaciones deportivas participantes.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'EQUIPO';

-- 6. TABLA: ESTADO_APUESTA
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Ciclo de vida de una quiniela (CREADA, ABIERTA, CERRADA, FINALIZADA).') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'ESTADO_APUESTA';

-- 7. TABLA: TIPO_PUNTUACION
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('decimal', 'numeric')
            THEN CAST(c.precision AS VARCHAR(5)) + ',' + CAST(c.scale AS VARCHAR(5))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Reglas puntuales de asignación: multiplicadores y penalizaciones.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'TIPO_PUNTUACION';

-- 8. TABLA: APUESTA
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Estructura principal de la quiniela o torneo activo.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'APUESTA';

-- 9. TABLA: EVENTO
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Encuentro deportivo concreto que el usuario debe pronosticar.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'EVENTO';

-- 10. TABLA: EVENTO_RESULTADO
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Marcador final real para validar los aciertos.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'EVENTO_RESULTADO';

-- 11. TABLA: USUARIO_APUESTA
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('decimal', 'numeric')
            THEN CAST(c.precision AS VARCHAR(5)) + ',' + CAST(c.scale AS VARCHAR(5))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Puntos totales acumulados por el jugador en una quiniela.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'USUARIO_APUESTA';

-- 12. TABLA: PRONOSTICO
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Marcadores proyectados (local/visitante) guardados por el jugador.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'PRONOSTICO';

-- 13. TABLA: PREMIO
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Catálogo de premios disponibles y los puntos requeridos para canjearlos.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'PREMIO';

-- 14. TABLA: CANJE
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('varchar', 'char') THEN CAST(c.max_length AS VARCHAR(10))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Transacciones de reclamo de premios y estados de aprobación.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'CANJE';

-- 15. TABLA: HISTORIAL_PUNTOS
SELECT
    t.name AS [TABLA],
    c.column_id AS [ORDEN],
    c.name AS [COLUMNA],
    ty.name AS [TIPO_DATO],
    CASE
        WHEN ty.name IN ('decimal', 'numeric')
            THEN CAST(c.precision AS VARCHAR(5)) + ',' + CAST(c.scale AS VARCHAR(5))
        ELSE 'N/A'
    END AS [TAMAÑO],
    CASE
        WHEN c.is_nullable = 1 THEN 'SÍ'
        ELSE 'NO'
    END AS [PERMITE_NULL],
    CASE
        WHEN ic.column_id IS NOT NULL THEN 'PK'
        ELSE ''
    END AS [TIPO_LLAVE],
    ISNULL(CAST(ep.value AS VARCHAR(MAX)), 'Auditoría pormenorizada de puntos ganados por cada partido acertado.') AS [DESCRIPCION_FUNCIONAL]
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id
    AND ep.minor_id = c.column_id
    AND ep.name = 'MS_Description'
LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    AND i.is_primary_key = 1
LEFT JOIN sys.index_columns ic ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
    AND c.column_id = ic.column_id
WHERE t.name = 'HISTORIAL_PUNTOS';
GO
