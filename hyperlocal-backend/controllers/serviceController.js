import {Service} from "../models/Service.js";

export const createService = async (req, res) => {
  const { title, price, description, category, location, image } = req.body;
  try {
    const service = new Service({
      title,
      price,
      description,
      category,
      location,
      image,                 
      provider: req.user._id,
    });
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export const getAllServices = async (req, res) => {
  const { search, category, location } = req.query;
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  const services = await Service.find(query).populate("provider");
  res.json(services);
};



export const getServiceById = async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id).populate("provider");
    if (!svc) return res.status(404).json({ message: "Service not found" });
    res.json(svc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// name,price,description,location,provider,rating