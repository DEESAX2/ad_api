import { Advert } from "../models/advert_model.js";
import { advertSchema } from "../schema/advert_schema.js";

export const createAdvert = async (req, res) => {

  try {
    const {error, value} = advertSchema.validate(req.body)
  
    if(error){
      return res.status(400).json(error.details[0].message)
    }

    const image = req.file

    const advert = await Advert.create({
      title: value.title,
      contact: value.contact,
      location: value.location,
      description: value.description,
      price: value.price,
      user: req.user.id,
      category: value.category,
      image: image.path
    });
    res.status(201).json(advert);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
};

export const getFilteredAdverts = async (req, res) => {
  const { title, category, location } = req.query;
  let filter = {};

  if (title) filter.title = new RegExp(title, 'i');
  if (category) filter.category = new RegExp(category, 'i');
  if (location) filter.location = new RegExp(location, 'i');

  

  try {
    const adverts = await Advert.find(filter).populate('user', 'firstName lastName email');
    res.json(adverts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// this is to get all listed adverts from the database
export const getAllAdverts = async (req, res) => {
    try{
        res.status(200).json( await Advert.find().populate('user', 'firstName lastName email'));
    } catch (error){
        res.status(500).json({error: error.message});
    }

};
// this to get a particular advert
export const getAdvertById = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!advert) return res.status(404).json({ message: 'this advert is not listed' });
    res.json(advert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// this is to update the details of an advert 
export const patchAdvert = async (req, res) => {
  try {
    const advert = await Advert.findByIdAndUpdate(req.params.id, req.body, { new: true }.populate('user', 'firstName lastName email'));
    if (!advert) return res.status(404).json({ message: 'this advert cannot be found' });
    res.json(advert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// get advert by a specific user
export const getMyAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find({ user: req.user.id });
    res.json(adverts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// to delete adverts only owned by a specific user 
export const deleteMyAdvert = async (req, res) => {
  try {
    const advert= await Advert.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!advert) {
      return res.status(404).json({ message: 'Advert not found' });
    }

    // to ensure the user owns the advert before deletion
    if (advert.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this advert. this advert is not yours to delete !!!' });
    }

    await advert.remove();
    res.json({ message: 'advert deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
