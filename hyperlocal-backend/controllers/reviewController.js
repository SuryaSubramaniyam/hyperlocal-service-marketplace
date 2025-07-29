import { Service } from '../models/Service.js';

export const addReview = async (req, res) => {
  try {
    const { serviceId } = req.params;
    let { rating, comment } = req.body;

    rating = Number(rating); 

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const already = service.reviews.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (already) {
      return res.status(400).json({ error: 'You already reviewed this service' });
    }

    service.reviews.push({
      user: req.user._id,
      rating,
      comment,
      createdAt: new Date(), 
    });


    service.rating =
      service.reviews.reduce((acc, r) => acc + r.rating, 0) /
      service.reviews.length;

    await service.save();

    res.status(201).json({
      message: 'Review added successfully',
      rating: service.rating,
    });
  } catch (err) {
    console.error(" addReview error:", err);
    res.status(500).json({ error: err.message });
  }
};
