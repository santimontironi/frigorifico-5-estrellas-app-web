import Photo from "../models/photo.model.js";

class PhotoRepository {
  async createPhoto(data) {
    return await Photo.create(data);
  }

  async getAllPhotos() {
    return await Photo.find().sort({ createdAt: -1 });
  }

  async deletePhotoById(id) {
    return await Photo.findByIdAndDelete(id);
  }
}

const photoRepository = new PhotoRepository();
export default photoRepository;
