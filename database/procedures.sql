/*
===================================================
PROYECTO     : Quiniela Copa del Mundo 2026
BASE DATOS   : PROYECTO
MOTOR        : SQL Server 2022 / SSMS 22
===================================================
*/

--
-- ========> adminController/EquiposController.js <=========
--
CREATE PROCEDURE ObtenerEquipos
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        ID_EQUIPO AS id_equipo,
        NOMBRE    AS nombre
    FROM EQUIPO
    ORDER BY ID_EQUIPO ASC;
END;
GO

-- --------------------------------------------------------

--
-- ========> adminController/ApuestaController.js <=========
--
CREATE PROCEDURE ObtenerApuestas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        a.ID_APUESTA        AS id_apuesta,
        a.NOMBRE            AS nombre,
        a.DESCRIPCION       AS descripcion,
        a.FECHA_INICIO      AS fecha_inicio,
        a.FECHA_FIN         AS fecha_fin,
        tp.NOMBRE           AS tipo_puntuacion,
        ea.NOMBRE           AS estado
    FROM APUESTA a
    INNER JOIN TIPO_PUNTUACION tp ON a.ID_TIPO_PUNTUACION = tp.ID_TIPO_PUNTUACION
    INNER JOIN ESTADO_APUESTA  ea ON a.ID_ESTADO_APUESTA  = ea.ID_ESTADO_APUESTA
    ORDER BY a.ID_APUESTA ASC;
END;
GO

-- --------------------------------------------------------
CREATE PROCEDURE ObtenerApuestaPorId
    @id_apuesta INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        a.ID_APUESTA        AS id_apuesta,
        a.NOMBRE            AS nombre,
        a.DESCRIPCION       AS descripcion,
        a.FECHA_INICIO      AS fecha_inicio,
        a.FECHA_FIN         AS fecha_fin,
        tp.NOMBRE           AS tipo_puntuacion,
        ea.NOMBRE           AS estado
    FROM APUESTA a
    INNER JOIN TIPO_PUNTUACION tp ON a.ID_TIPO_PUNTUACION = tp.ID_TIPO_PUNTUACION
    INNER JOIN ESTADO_APUESTA  ea ON a.ID_ESTADO_APUESTA  = ea.ID_ESTADO_APUESTA
    WHERE a.ID_APUESTA = @id_apuesta;
END;
GO

-- --------------------------------------------------------

--
-- ========> adminController/ResultadoController.js <=========
--
CREATE PROCEDURE ObtenerApuestasResultados
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        a.ID_APUESTA          AS id_apuesta,
        a.NOMBRE              AS nombre,
        ea.NOMBRE             AS estado,
        a.ID_ESTADO_APUESTA   AS id_estado_apuesta,
        (
            SELECT TOP 1 er.PTS_EQUIPO_A
            FROM EVENTO e
            INNER JOIN EVENTO_RESULTADO er ON er.ID_EVENTO = e.ID_EVENTO
            WHERE e.ID_APUESTA = a.ID_APUESTA
        ) AS pts_local,
        (
            SELECT TOP 1 er.PTS_EQUIPO_B
            FROM EVENTO e
            INNER JOIN EVENTO_RESULTADO er ON er.ID_EVENTO = e.ID_EVENTO
            WHERE e.ID_APUESTA = a.ID_APUESTA
        ) AS pts_visitante
    FROM APUESTA a
    INNER JOIN ESTADO_APUESTA ea ON a.ID_ESTADO_APUESTA = ea.ID_ESTADO_APUESTA
    ORDER BY a.ID_APUESTA DESC;
END;
GO

-- --------------------------------------------------------

--
-- ========> adminController/PremiosController.js <=========
--
CREATE PROCEDURE ObtenerCanjes
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        c.ID_CANJE      AS id_canje,
        c.PUNTOS_USADOS AS puntos_usados,
        c.FECHA_CANJE   AS fecha_canje,
        c.ESTADO        AS estado,
        p.NOMBRE        AS nombre_premio,
        u.USERNAME      AS username
    FROM CANJE c
    JOIN PREMIO  p ON c.ID_PREMIO  = p.ID_PREMIO
    JOIN USUARIO u ON c.ID_USUARIO = u.ID_USUARIO
    ORDER BY c.FECHA_CANJE DESC;
END;
GO

-- --------------------------------------------------------

--
-- ========> adminController/UsuariosController.js <=========
--
CREATE PROCEDURE obtenerUsuarios
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        u.ID_USUARIO            AS id_usuario,
        u.USERNAME              AS username,
        u.CORREO_ELECTRONICO    AS correo_electronico,
        CONCAT(p.PRIMER_NOMBRE, ' ', p.PRIMER_APELLIDO) AS nombre,
        e.ROL                   AS rol,
        e.ESTADO                AS estado
    FROM USUARIO u
    INNER JOIN PERSONA      p ON u.ID_PERSONA = p.ID_PERSONA
    INNER JOIN ESTADO_USUARIO e ON u.ID_USUARIO = e.ID_USUARIO
    ORDER BY u.ID_USUARIO ASC;
END;
GO

-- --------------------------------------------------------

--
-- ========> playerController/ApuestasJugadorController.js <=========
--
CREATE PROCEDURE ObtenerApuestasJugador
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        a.ID_APUESTA        AS id_apuesta,
        a.NOMBRE            AS nombre,
        a.DESCRIPCION       AS descripcion,
        a.REGLAS            AS reglas,
        a.FECHA_INICIO      AS fecha_inicio,
        a.FECHA_FIN         AS fecha_fin,
        ea.NOMBRE           AS estado,
        tp.NOMBRE           AS tipo_puntuacion,
        ua.PUNTOS           AS mis_puntos,
        CASE WHEN ua.ID_USUARIO IS NOT NULL THEN 1 ELSE 0 END AS ya_unido,
        (
            SELECT STRING_AGG(
                CASE
                    WHEN er.PTS_EQUIPO_A IS NOT NULL AND er.PTS_EQUIPO_B IS NOT NULL
                    THEN CAST(er.PTS_EQUIPO_A AS VARCHAR(10)) + ' - ' + CAST(er.PTS_EQUIPO_B AS VARCHAR(10))
                    ELSE er.RESULTADO
                END,
                ' | '
            )
            FROM EVENTO e2
            JOIN EVENTO_RESULTADO er ON e2.ID_EVENTO = er.ID_EVENTO
            WHERE e2.ID_APUESTA = a.ID_APUESTA
        ) AS resultado_oficial
    FROM APUESTA a
    JOIN TIPO_PUNTUACION  tp ON a.ID_TIPO_PUNTUACION = tp.ID_TIPO_PUNTUACION
    JOIN ESTADO_APUESTA   ea ON a.ID_ESTADO_APUESTA  = ea.ID_ESTADO_APUESTA
    LEFT JOIN USUARIO_APUESTA ua ON a.ID_APUESTA = ua.ID_APUESTA
              AND ua.ID_USUARIO = @id_usuario
    WHERE ea.NOMBRE IN ('ABIERTA', 'CERRADA', 'FINALIZADA')
    ORDER BY a.FECHA_INICIO DESC;
END;
GO

-- --------------------------------------------------------
CREATE PROCEDURE ObtenerEventosApuesta
    @id_apuesta INT,
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        e.ID_EVENTO             AS id_evento,
        e.NOMBRE                AS nombre,
        e.FECHA                 AS fecha,
        p.ID_PRONOSTICO         AS id_pronostico,
        p.PTS_LOCAL             AS prono_local,
        p.PTS_VISITANTE         AS prono_visitante,
        er.RESULTADO            AS resultado_oficial,
        er.PTS_EQUIPO_A         AS pts_equipo_a,
        er.PTS_EQUIPO_B         AS pts_equipo_b,
        NULL                    AS equipo_local,
        NULL                    AS equipo_visitante
    FROM EVENTO e
    LEFT JOIN PRONOSTICO p
        ON e.ID_EVENTO   = p.ID_EVENTO
        AND p.ID_USUARIO = @id_usuario
    LEFT JOIN EVENTO_RESULTADO er
        ON e.ID_EVENTO = er.ID_EVENTO
    WHERE e.ID_APUESTA = @id_apuesta
    ORDER BY e.FECHA ASC;
END;
GO

-- --------------------------------------------------------
CREATE PROCEDURE ObtenerRanking
    @id_apuesta INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        ROW_NUMBER() OVER (ORDER BY ua.PUNTOS DESC) AS posicion,
        u.USERNAME  AS username,
        ua.PUNTOS   AS puntos,
        (
            SELECT COUNT(*)
            FROM PRONOSTICO p
            JOIN EVENTO e ON p.ID_EVENTO = e.ID_EVENTO
            WHERE p.ID_USUARIO = ua.ID_USUARIO
              AND e.ID_APUESTA  = ua.ID_APUESTA
        ) AS pronosticos
    FROM USUARIO_APUESTA ua
    JOIN USUARIO u ON ua.ID_USUARIO = u.ID_USUARIO
    WHERE ua.ID_APUESTA = @id_apuesta
    ORDER BY ua.PUNTOS DESC;
END;
GO

-- --------------------------------------------------------
CREATE PROCEDURE ObtenerRankingGlobal
AS
BEGIN
    SET NOCOUNT ON;
    WITH Totales AS (
        SELECT
            u.USERNAME                          AS username,
            SUM(ua.PUNTOS)                      AS puntos_totales,
            COUNT(DISTINCT ua.ID_APUESTA)       AS apuestas_participadas
        FROM USUARIO_APUESTA ua
        JOIN USUARIO u ON ua.ID_USUARIO = u.ID_USUARIO
        GROUP BY ua.ID_USUARIO, u.USERNAME
    )
    SELECT
        ROW_NUMBER() OVER (ORDER BY puntos_totales DESC, username ASC) AS posicion,
        username,
        puntos_totales,
        apuestas_participadas
    FROM Totales
    ORDER BY puntos_totales DESC, username ASC;
END;
GO

-- --------------------------------------------------------

--
-- ========> playerController/PremiosJugadorController.js <=========
--
CREATE PROCEDURE ObtenerPuntosUsuario
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    WITH Total AS (
        SELECT COALESCE(SUM(PUNTOS), 0) AS total
        FROM USUARIO_APUESTA
        WHERE ID_USUARIO = @id_usuario
    ),
    Gastado AS (
        SELECT COALESCE(SUM(PUNTOS_USADOS), 0) AS gastado
        FROM CANJE
        WHERE ID_USUARIO = @id_usuario
          AND ESTADO != 'RECHAZADO'
    )
    SELECT
        t.total,
        g.gastado,
        t.total - g.gastado AS disponible
    FROM Total t, Gastado g;
END;
GO

-- --------------------------------------------------------

CREATE PROCEDURE ObtenerParticipantesApuesta
    @id_apuesta INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        p.PRIMER_NOMBRE + ' ' + p.PRIMER_APELLIDO  AS nombre,
        u.USERNAME                                  AS username,
        ua.PUNTOS                                   AS puntos
    FROM USUARIO_APUESTA ua
    JOIN USUARIO u ON ua.ID_USUARIO = u.ID_USUARIO
    JOIN PERSONA p ON u.ID_PERSONA  = p.ID_PERSONA
    WHERE ua.ID_APUESTA = @id_apuesta
    ORDER BY ua.PUNTOS DESC;
END;
GO

-- --------------------------------------------------------

CREATE PROCEDURE ObtenerMisCanjes
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        c.ID_CANJE      AS id_canje,
        c.PUNTOS_USADOS AS puntos_usados,
        c.FECHA_CANJE   AS fecha_canje,
        c.ESTADO        AS estado,
        p.NOMBRE        AS nombre_premio,
        p.DESCRIPCION   AS descripcion_premio
    FROM CANJE c
    JOIN PREMIO p ON c.ID_PREMIO = p.ID_PREMIO
    WHERE c.ID_USUARIO = @id_usuario
    ORDER BY c.FECHA_CANJE DESC;
END;
GO
