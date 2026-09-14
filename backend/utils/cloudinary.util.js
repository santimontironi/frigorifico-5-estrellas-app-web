import cloudinary from "../config/cloudinary.config.js";

// Reconstruye el public_id de Cloudinary a partir de la URL guardada
// (no hay campo aparte: "products/<archivo>" sin extensión ni version).
function getPublicIdFromUrl(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

// Borrado best-effort: si Cloudinary falla no debe romper el flujo que lo llama.
export function deleteCloudinaryImage(url) {
  if (!url) return;
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return;
  cloudinary.uploader
    .destroy(publicId)
    .catch((err) => console.error("Error al borrar imagen de Cloudinary:", err.message));
}
