import rateLimit from "express-rate-limit";

// Limitador de peticiones por IP para registro,
// bloquea si son muchos intentos fallidos
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { message: "Demasiados intentos de login, espera 1 hora" }
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { message: "Demasiados registros desde esta IP" }
});
