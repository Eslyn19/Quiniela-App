export const verificarAdmin = (req, res) => {
    return res.json({ username: req.user.username, rol: 'ADMIN' });
};
