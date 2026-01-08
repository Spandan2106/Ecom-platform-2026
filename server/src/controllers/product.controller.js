import Product from "../models/Product.model.js";
import Review from "../models/Review.model.js";

export const getProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1, _id: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    const reviews = await Review.find({ product: req.params.id });
    res.json({ ...product.toObject(), reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = new Review({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      product: req.params.id,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};