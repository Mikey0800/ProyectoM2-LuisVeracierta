if (!director) {
return res.status(400).json({
error: "El director es obligatorio"
});
}