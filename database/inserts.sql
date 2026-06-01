/*
===================================================
PROYECTO     : Quiniela Copa del Mundo 2026
BASE DATOS   : PROYECTO
MOTOR        : SQL Server 2022
===================================================
*/

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
    500, 5, 1,
    '/uploads/premios/ReplicaCopa.jpg'
),
(
    'Camiseta Local España FWC 2026',
    'Camiseta oficial Adidas de la selección española, edición local para la Copa del Mundo 2026. Blanca con detalles en rojo y dorado.',
    300, 10, 1,
    '/uploads/premios/EspanaLocalFW2026.jpg'
),
(
    'Camiseta Local Alemania FWC 2026',
    'Camiseta oficial Adidas de la selección alemana, edición local para la Copa del Mundo 2026. Blanca con diseño de rombos y los cuatro estrellas.',
    300, 10, 1,
    '/uploads/premios/AlemaniaLocalFWC2026.jpg'
),
(
    'Álbum Panini + Caja de Sobres FWC 2026',
    'Combo oficial Panini: álbum de figuritas FIFA World Cup 2026 + caja de 50 sobres. Colecciona las 648 figuritas del torneo.',
    150, 20, 1,
    '/uploads/premios/Album+Cubo.jpg'
),
(
    'Caja de Sobres Panini FWC 2026',
    'Caja oficial Panini con 50 sobres de figuritas FIFA World Cup 2026. Ideal para completar el álbum o intercambiar.',
    80, 30, 1,
    '/uploads/premios/Cubo.jpg'
),
(
    'Peluche Mascota Clutch (USA)',
    'Peluche oficial de Clutch, la mascota del equipo anfitrión Estados Unidos para el Mundial 2026. Águila con camiseta azul del #10.',
    100, 15, 1,
    '/uploads/premios/Clutch.jpg'
),
(
    'Peluche Mascota Maple (Canadá)',
    'Peluche oficial de Maple, la mascota del equipo anfitrión Canadá para el Mundial 2026. Alce con camiseta roja del #1.',
    100, 15, 1,
    '/uploads/premios/Maple.jpg'
),
(
    'Peluche Mascota Zayu (México)',
    'Peluche oficial de Zayu, la mascota del equipo anfitrión México para el Mundial 2026. Jaguar con camiseta verde del #9.',
    100, 15, 1,
    '/uploads/premios/Zayu.webp'
);
GO