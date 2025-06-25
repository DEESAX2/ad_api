import { Router } from 'express';
import { createAdvert, getFilteredAdverts, getAllAdverts, getAdvertById, patchAdvert, getMyAdverts, deleteMyAdvert } from '../controllers/advert_controller.js';
import { authenticate, hasPermission } from '../middlewares/auth.js';

import { parser } from '../utils/cloudinary.js';

export const AdvertRouter = Router();



AdvertRouter.post("/add", authenticate, hasPermission("postService"), parser.single("image"), createAdvert);
AdvertRouter.get("/filtered/adverts", getFilteredAdverts);
AdvertRouter.get("/all/adverts", getAllAdverts);
AdvertRouter.get("/my/adverts", authenticate, hasPermission("getMyServices"),getMyAdverts);
AdvertRouter.get("/one/advert/:id", getAdvertById);
AdvertRouter.patch("/update/:id", authenticate, hasPermission("patchService"), patchAdvert);
AdvertRouter.delete("/delete/:id", authenticate, hasPermission("deleteMyService"), deleteMyAdvert);
