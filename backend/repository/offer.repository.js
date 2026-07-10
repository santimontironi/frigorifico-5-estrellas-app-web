import Offer from "../models/offer.model.js";

class OfferRepository {
  async createOffer(data) {
    return await Offer.create(data);
  }

  async getAllOffers() {
    const offers = await Offer.find({ active: true })
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        match: { active: true },
        select: "name price unit image",
      });

    return offers.filter((o) => o.product !== null);
  }

  async findActiveOfferByProduct(productId) {
    return await Offer.findOne({ product: productId, active: true });
  }

  async deleteOfferById(id) {
    return await Offer.findByIdAndUpdate(
      id,
      { active: false },
      { returnDocument: "after" },
    );
  }
}

const offerRepository = new OfferRepository();
export default offerRepository;
