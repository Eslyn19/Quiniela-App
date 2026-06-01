// Controlador envuelto para controladores asíncronos que evita repetir try/catch 
// y propaga errores mediante next().
export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
