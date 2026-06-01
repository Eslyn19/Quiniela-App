// Verificar si al registrarse el USUARIO tenga ROL de ADMIN
export const verificarAdmin = (req, res) => {
  return res.json({ 
    username: req.user.username, 
    rol: 'ADMIN' 
  });
};
