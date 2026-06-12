/*
===================================================
PROYECTO     : Quiniela de deportes                     
BASE DATOS   : PROYECTO
MOTOR        : SQL Server 2022
===================================================
*/

-- Borrar si existe
DROP DATABASE IF EXISTS PROYECTO;
GO

-- Crear la DB
CREATE DATABASE PROYECTO;
GO 

-- Configuración de la DB
ALTER DATABASE PROYECTO SET RECOVERY FULL; -- Habilita backups de log de transacciones
ALTER DATABASE PROYECTO SET AUTO_CLOSE OFF; -- Mantiene la BD en memoria siempre activa
ALTER DATABASE PROYECTO SET AUTO_SHRINK OFF; -- Evita reducción automática del archivo de datos
GO

USE PROYECTO;
GO

-- Crar usuario para la conexion SQL Authentication e ingreso
-- a la DB con permisos de administrador.
CREATE LOGIN [admin] WITH PASSWORD = 'root' 
CHECK_POLICY = OFF, 
CHECK_EXPIRATION = OFF;
GO

CREATE USER [admin] FOR LOGIN [admin];
GO

ALTER ROLE db_owner ADD MEMBER [admin];
GO

-- Datos personales base de cualquier individuo, sea usuario o atleta.
DROP TABLE IF EXISTS PERSONA;
GO
CREATE TABLE PERSONA
(
    ID_PERSONA          INT IDENTITY(1,1) PRIMARY KEY,
    PRIMER_NOMBRE       VARCHAR(20)       NOT NULL,
    SEGUNDO_NOMBRE      VARCHAR(20)       NULL,
    PRIMER_APELLIDO     VARCHAR(20)       NOT NULL,
    SEGUNDO_APELLIDO    VARCHAR(20)       NULL,
    FECHA_NACIMIENTO    DATE              NOT NULL --yy/mm/dd
);
GO

-- Credenciales de acceso. Cada usuario está vinculado a una unica persona.
DROP TABLE IF EXISTS USUARIO;
GO
CREATE TABLE USUARIO
(
    ID_USUARIO          INT IDENTITY(1,1) PRIMARY KEY,
    ID_PERSONA          INT               UNIQUE NOT NULL, 
    CORREO_ELECTRONICO  VARCHAR(100)      UNIQUE NOT NULL,
    USERNAME            VARCHAR(50)       UNIQUE NOT NULL,
    PASS                VARCHAR(255)      NOT NULL, -- hash
   
    CONSTRAINT FK_PERSONA_USUARIO
    FOREIGN KEY (ID_PERSONA)
    REFERENCES PERSONA(ID_PERSONA)
);
GO

-- Historial de rol y estado por usuario.
DROP TABLE IF EXISTS ESTADO_USUARIO;
GO
CREATE TABLE ESTADO_USUARIO
(
    ID_ESTADO_USUARIO   INT IDENTITY(1,1) PRIMARY KEY,
    ID_USUARIO          INT               NOT NULL, 
    ROL                 VARCHAR(10)       NOT NULL,
    ESTADO              VARCHAR(20)       NOT NULL,

    CONSTRAINT FK_ESTADO_USUARIO
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO),

    CONSTRAINT CK_ROL CHECK (ROL IN ('ADMIN', 'JUGADOR')),
    
    CONSTRAINT CK_ESTADOUSER CHECK ( ESTADO IN (
        'PENDIENTE', 'APROBADO', 'RECHAZADO','SUSPENDIDO') 
    )
);
GO

-- Selecciones nacionales participantes en Copa del Mundo 2026.
DROP TABLE IF EXISTS EQUIPO;
GO
CREATE TABLE EQUIPO
(
    ID_EQUIPO  INT IDENTITY(1,1) PRIMARY KEY,
    NOMBRE     VARCHAR(50)       UNIQUE NOT NULL
);
GO

-- Ciclo de vida de una apuesta
DROP TABLE IF EXISTS ESTADO_APUESTA;
GO
CREATE TABLE ESTADO_APUESTA
(
    ID_ESTADO_APUESTA INT IDENTITY(1,1) PRIMARY KEY,
    NOMBRE VARCHAR(10) UNIQUE NOT NULL,

    CONSTRAINT CK_ESTADO_APUESTA 
    CHECK (NOMBRE IN ('CREADA','ABIERTA','CERRADA','FINALIZADA'))
);
GO

--  Base para la puntuacion de una apuesta
DROP TABLE IF EXISTS TIPO_PUNTUACION;
GO
CREATE TABLE TIPO_PUNTUACION 
(
    ID_TIPO_PUNTUACION INT IDENTITY(1,1) PRIMARY KEY,
    NOMBRE             VARCHAR(100)      UNIQUE NOT NULL,
    PUNTOS_BASE        DECIMAL(5,2)      NOT NULL DEFAULT 1.00,
    MULTIPLICADOR      DECIMAL(5,2)      NOT NULL DEFAULT 1.00,
    PENALIZACION       DECIMAL(5,2)      NOT NULL DEFAULT 0.00
);
GO

-- Apuesta principal. Agrupa eventos bajo nombre, reglas, fechas
-- y tipo de puntuacion.
DROP TABLE IF EXISTS APUESTA;
GO
CREATE TABLE APUESTA
(
    ID_APUESTA          INT IDENTITY(1,1) PRIMARY KEY,
    ID_ESTADO_APUESTA   INT               NOT NULL,
    ID_TIPO_PUNTUACION  INT               NOT NULL,
    ID_EQUIPO_LOCAL     INT               NULL,
    ID_EQUIPO_VISITANTE INT               NULL,
    NOMBRE              VARCHAR(100)      UNIQUE NOT NULL,
    DESCRIPCION         VARCHAR(500)      NOT NULL,
    REGLAS              VARCHAR(500)      NOT NULL,
    FECHA_INICIO        DATETIME2         NOT NULL,
    FECHA_FIN           DATETIME2         NOT NULL,
    FECHA_CREACION      DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_APUESTA_EQUIPO_LOCAL
        FOREIGN KEY (ID_EQUIPO_LOCAL)
        REFERENCES EQUIPO(ID_EQUIPO),

    CONSTRAINT FK_APUESTA_EQUIPO_VISITANTE
        FOREIGN KEY (ID_EQUIPO_VISITANTE)
        REFERENCES EQUIPO(ID_EQUIPO),

    CONSTRAINT FK_APUESTA_ESTADO
    FOREIGN KEY (ID_ESTADO_APUESTA)
    REFERENCES ESTADO_APUESTA(ID_ESTADO_APUESTA),

    CONSTRAINT FK_APUESTA_TIPO_PUNT
    FOREIGN KEY (ID_TIPO_PUNTUACION)
    REFERENCES TIPO_PUNTUACION(ID_TIPO_PUNTUACION),

    CONSTRAINT CK_EQUIPOS_DISTINTOS
        CHECK (ID_EQUIPO_LOCAL <> ID_EQUIPO_VISITANTE),

    CONSTRAINT CK_FECHAS CHECK (FECHA_FIN > FECHA_INICIO)
);
GO

-- Evento individual dentro de una apuesta. Es lo que el jugador debe predecir.
DROP TABLE IF EXISTS EVENTO;
GO
CREATE TABLE EVENTO
(
    ID_EVENTO       INT IDENTITY(1,1) PRIMARY KEY,
    ID_APUESTA      INT               NOT NULL,
    NOMBRE          VARCHAR(100)      NOT NULL,
    FECHA           DATETIME2         NOT NULL,
    
    CONSTRAINT FK_EVENTO_APUESTA
    FOREIGN KEY (ID_APUESTA)
    REFERENCES APUESTA(ID_APUESTA)
);
GO

-- Resultado oficial de un evento. Se usa para evaluar pronosticos al cerrar.
DROP TABLE IF EXISTS EVENTO_RESULTADO;
GO
CREATE TABLE EVENTO_RESULTADO
(
    ID_EVENTO_RESULTADO INT IDENTITY(1,1) PRIMARY KEY,
    ID_EVENTO           INT               NOT NULL UNIQUE,
    RESULTADO           VARCHAR(100)      NOT NULL,
    PTS_EQUIPO_A        INT,
    PTS_EQUIPO_B        INT,
    FECHA_REGISTRO      DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT FK_EVRES_EVENTO
    FOREIGN KEY (ID_EVENTO)
    REFERENCES EVENTO(ID_EVENTO)
);
GO

-- RELACIÓN USUARIO - APUESTA (participación + puntos)
DROP TABLE IF EXISTS USUARIO_APUESTA;
GO
CREATE TABLE USUARIO_APUESTA
(
    ID_USUARIO  INT NOT NULL,
    ID_APUESTA  INT NOT NULL,
    PUNTOS      DECIMAL(10,2) DEFAULT 0,

    PRIMARY KEY (ID_USUARIO, ID_APUESTA),

    CONSTRAINT FK_UA_USUARIO
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO),

    CONSTRAINT FK_UA_APUESTA
    FOREIGN KEY (ID_APUESTA)
    REFERENCES APUESTA(ID_APUESTA)
);
GO

-- PRONÓSTICO (lo que predice el usuario: marcador local y visitante)
DROP TABLE IF EXISTS PRONOSTICO;
GO
CREATE TABLE PRONOSTICO
(
    ID_PRONOSTICO  INT IDENTITY(1,1) PRIMARY KEY,
    ID_USUARIO     INT NOT NULL,
    ID_EVENTO      INT NOT NULL,

    PTS_LOCAL      INT NOT NULL DEFAULT 0,
    PTS_VISITANTE  INT NOT NULL DEFAULT 0,
    FECHA_REGISTRO DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT UQ_PRONOSTICO UNIQUE (ID_USUARIO, ID_EVENTO),

    CONSTRAINT FK_PRON_USUARIO
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO),

    CONSTRAINT FK_PRON_EVENTO
    FOREIGN KEY (ID_EVENTO)
    REFERENCES EVENTO(ID_EVENTO)
);
GO

-- Catálogo de premios canjeables por puntos.

DROP TABLE IF EXISTS PREMIO;
GO
CREATE TABLE PREMIO
(
    ID_PREMIO       INT IDENTITY(1,1) PRIMARY KEY,
    NOMBRE          VARCHAR(100)      NOT NULL,
    DESCRIPCION     VARCHAR(500)      NOT NULL,
    COSTO_PUNTOS    INT               NOT NULL,
    STOCK           INT               NULL,        -- NULL = ilimitado
    ACTIVO          BIT               NOT NULL DEFAULT 1,
    FECHA_INICIO    DATE              NULL,
    FECHA_FIN       DATE              NULL,
    IMAGEN_URL      VARCHAR(500)      NULL,

    CONSTRAINT CK_COSTO_PUNTOS CHECK (COSTO_PUNTOS > 0)
);
GO

-- Registro de canjes realizados por los jugadores.
DROP TABLE IF EXISTS CANJE;
GO
CREATE TABLE CANJE
(
    ID_CANJE        INT IDENTITY(1,1) PRIMARY KEY,
    ID_USUARIO      INT               NOT NULL,
    ID_PREMIO       INT               NOT NULL,
    PUNTOS_USADOS   INT               NOT NULL,
    FECHA_CANJE     DATETIME2         DEFAULT SYSDATETIME(),
    ESTADO          VARCHAR(20)       NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT FK_CANJE_USUARIO
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO),

    CONSTRAINT FK_CANJE_PREMIO
    FOREIGN KEY (ID_PREMIO)
    REFERENCES PREMIO(ID_PREMIO),

    CONSTRAINT CK_ESTADO_CANJE
    CHECK (ESTADO IN ('PENDIENTE','ENTREGADO','RECHAZADO'))
);
GO

--  Detalle de cada movimiento de puntos por pronóstico evaluado.
DROP TABLE IF EXISTS HISTORIAL_PUNTOS;
GO
CREATE TABLE HISTORIAL_PUNTOS
(
    ID_HISTORIAL    INT IDENTITY(1,1) PRIMARY KEY,
    ID_USUARIO      INT           NOT NULL,
    ID_APUESTA      INT           NOT NULL,
    ID_PRONOSTICO   INT           NOT NULL,
    PUNTOS          DECIMAL(10,2) NOT NULL,
    FECHA_REGISTRO  DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT FK_HP_USUARIO
    FOREIGN KEY (ID_USUARIO)
    REFERENCES USUARIO(ID_USUARIO),

    CONSTRAINT FK_HP_APUESTA
    FOREIGN KEY (ID_APUESTA)
    REFERENCES APUESTA(ID_APUESTA),

    CONSTRAINT FK_HP_PRONOSTICO
    FOREIGN KEY (ID_PRONOSTICO)
    REFERENCES PRONOSTICO(ID_PRONOSTICO)
);
GO

------------------------------------------------------------------------------------
----------------------------------INDICES
-- EVENTO
CREATE INDEX IX_EVENTO_APUESTA
    ON EVENTO (ID_APUESTA)
    INCLUDE (NOMBRE, FECHA);
GO

-- PRONOSTICO
CREATE INDEX IX_PRONOSTICO_EVENTO_USUARIO
    ON PRONOSTICO (ID_EVENTO, ID_USUARIO)
    INCLUDE (PTS_LOCAL, PTS_VISITANTE, ID_PRONOSTICO);
GO

-- USUARIO_APUESTA
CREATE INDEX IX_UA_APUESTA_USUARIO
    ON USUARIO_APUESTA (ID_APUESTA, ID_USUARIO)
    INCLUDE (PUNTOS);
GO

-- Índice inverso para búsquedas por usuario (ranking global, historial)
CREATE INDEX IX_UA_USUARIO_APUESTA
    ON USUARIO_APUESTA (ID_USUARIO)
    INCLUDE (ID_APUESTA, PUNTOS);
GO

-- EVENTO_RESULTADO
CREATE INDEX IX_EVRES_EVENTO
    ON EVENTO_RESULTADO (ID_EVENTO)
    INCLUDE (RESULTADO, PTS_EQUIPO_A, PTS_EQUIPO_B);
GO

-- APUESTA
CREATE INDEX IX_APUESTA_ESTADO
    ON APUESTA (ID_ESTADO_APUESTA)
    INCLUDE (NOMBRE, FECHA_INICIO, FECHA_FIN, ID_TIPO_PUNTUACION, DESCRIPCION);
GO

-- ESTADO_USUARIO
CREATE INDEX IX_ESTADOUSER_USUARIO
    ON ESTADO_USUARIO (ID_USUARIO)
    INCLUDE (ROL, ESTADO);
GO

-- HISTORIAL_PUNTOS
CREATE INDEX IX_HP_USUARIO
    ON HISTORIAL_PUNTOS (ID_USUARIO)
    INCLUDE (ID_APUESTA, ID_PRONOSTICO);
GO

CREATE INDEX IX_HP_APUESTA
    ON HISTORIAL_PUNTOS (ID_APUESTA);
GO

CREATE INDEX IX_HP_PRONOSTICO
    ON HISTORIAL_PUNTOS (ID_PRONOSTICO);
GO

-------------------------------------------------------------------------------------------------------------------
----------------------- INSERTS
USE PROYECTO;
GO

-- --------- ADMINISTRADOR ---------
BEGIN TRANSACTION
BEGIN TRY
    INSERT INTO PERSONA (PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, FECHA_NACIMIENTO)
    VALUES ('Roger', NULL, 'Leon', 'Brenes', '1990-06-01');
    DECLARE @ID_PERSONA_1 INT = SCOPE_IDENTITY();

    INSERT INTO USUARIO (ID_PERSONA, CORREO_ELECTRONICO, USERNAME, PASS)
    VALUES (@ID_PERSONA_1, 'rogeradmin@quiniela.com', 'admin',
            '$2a$12$J0dUjUf1C4H5exiS5ti1T.ZsiVWZaery/BYYy.hPVIYC2SVE8ZrnK'); -- Proyecto123$
    DECLARE @ID_USUARIO_1 INT = SCOPE_IDENTITY();

    INSERT INTO ESTADO_USUARIO (ID_USUARIO, ROL, ESTADO)
    VALUES (@ID_USUARIO_1, 'ADMIN', 'APROBADO');

    COMMIT TRANSACTION;
    PRINT 'Admin insertado correctamente.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Error al insertar admin: ' + ERROR_MESSAGE();
END CATCH
GO

-- --------- ESTADOS DE APUESTA ---------
SET IDENTITY_INSERT ESTADO_APUESTA ON;
INSERT INTO ESTADO_APUESTA (ID_ESTADO_APUESTA, NOMBRE) VALUES
(1, 'CREADA'),
(2, 'ABIERTA'),
(3, 'CERRADA'),
(4, 'FINALIZADA');
SET IDENTITY_INSERT ESTADO_APUESTA OFF;
GO

-- --------- TIPOS DE PUNTUACION ---------
INSERT INTO TIPO_PUNTUACION (NOMBRE, PUNTOS_BASE, MULTIPLICADOR, PENALIZACION) VALUES
('Marcador Exacto',   3.00, 1.50, 1.00),
('Resultado',         2.00, 1.00, 0.00),
('Primer Goleador',   2.00, 1.25, 1.50),
('Mas o Menos Goles', 1.00, 1.10, 1.00),
('Ganador del torneo',5.00, 2.00, 0.00);
GO

-- --------- 48 SELECCIONES COPA DEL MUNDO 2026 ---------
INSERT INTO EQUIPO (NOMBRE) VALUES
-- Grupo A
('Mexico'),
('Sudafrica'),
('Corea del Sur'),
('Chequia'),
-- Grupo B
('Canada'),
('Bosnia-Herzegovina'),
('Qatar'),
('Suiza'),
-- Grupo C
('Brasil'),
('Marruecos'),
('Haiti'),
('Escocia'),
-- Grupo D
('Estados Unidos'),
('Paraguay'),
('Australia'),
('Turquia'),
-- Grupo E
('Alemania'),
('Curacao'),
('Costa de Marfil'),
('Ecuador'),
-- Grupo F
('Paises Bajos'),
('Japon'),
('Suecia'),
('Tunez'),
-- Grupo G
('Belgica'),
('Egipto'),
('Iran'),
('Nueva Zelanda'),
-- Grupo H
('Espana'),
('Cabo Verde'),
('Arabia Saudita'),
('Uruguay'),
-- Grupo I
('Francia'),
('Senegal'),
('Iraq'),
('Noruega'),
-- Grupo J
('Argentina'),
('Argelia'),
('Austria'),
('Jordania'),
-- Grupo K
('Portugal'),
('Congo Rep. Dem.'),
('Uzbekistan'),
('Colombia'),
-- Grupo L
('Inglaterra'),
('Croacia'),
('Ghana'),
('Panama');
GO

-- --------- PREMIOS ---------
INSERT INTO PREMIO (NOMBRE, DESCRIPCION, COSTO_PUNTOS, STOCK, ACTIVO, IMAGEN_URL) VALUES
(
    'Réplica Copa del Mundo',
    'Réplica oficial de la Copa del Mundo FIFA. El trofeo más icónico del fútbol, edición coleccionable de alta calidad.',
    10, 5, 1,
    '/uploads/premios/ReplicaCopa.jpg'
),
(
    'Camiseta Local España FWC 2026',
    'Camiseta oficial Adidas de la selección española, edición local para la Copa del Mundo 2026. Blanca con detalles en rojo y dorado.',
    5, 10, 1,
    '/uploads/premios/EspanaLocalFW2026.jpg'
),
(
    'Camiseta Local Alemania FWC 2026',
    'Camiseta oficial Adidas de la selección alemana, edición local para la Copa del Mundo 2026. Blanca con diseño de rombos y los cuatro estrellas.',
    5, 10, 1,
    '/uploads/premios/AlemaniaLocalFWC2026.jpg'
),
(
    'Álbum Panini + Caja de Sobres FWC 2026',
    'Combo oficial Panini: álbum de figuritas FIFA World Cup 2026 + caja de 50 sobres. Colecciona las 648 figuritas del torneo.',
    10, 20, 1,
    '/uploads/premios/Album+Cubo.jpg'
),
(
    'Caja de Sobres Panini FWC 2026',
    'Caja oficial Panini con 50 sobres de figuritas FIFA World Cup 2026. Ideal para completar el álbum o intercambiar.',
    5, 30, 1,
    '/uploads/premios/Cubo.jpg'
),
(
    'Peluche Mascota Clutch (USA)',
    'Peluche oficial de Clutch, la mascota del equipo anfitrión Estados Unidos para el Mundial 2026. Águila con camiseta azul del #10.',
    1, 15, 1,
    '/uploads/premios/Clutch.jpg'
),
(
    'Peluche Mascota Maple (Canadá)',
    'Peluche oficial de Maple, la mascota del equipo anfitrión Canadá para el Mundial 2026. Alce con camiseta roja del #1.',
    1, 15, 1,
    '/uploads/premios/Maple.jpg'
),
(
    'Peluche Mascota Zayu (México)',
    'Peluche oficial de Zayu, la mascota del equipo anfitrión México para el Mundial 2026. Jaguar con camiseta verde del #9.',
    1, 15, 1,
    '/uploads/premios/Zayu.webp'
);
GO

------------------------------------------------------------------------------------------------------------------------------------
-------------- PROCEDURES
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