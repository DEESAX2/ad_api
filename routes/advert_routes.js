import { Router } from 'express';
import { createAdvert, getFilteredAdverts, getAllAdverts, getAdvertById, patchAdvert, getMyAdverts, deleteMyAdvert } from '../controllers/advert_controller.js';
import { authenticate, hasPermission } from '../middlewares/auth.js';

import { parser } from '../utils/cloudinary.js';

export const AdvertRouter = Router();



AdvertRouter.post("/", authenticate, hasPermission("postService"), parser.single("image"), createAdvert);
AdvertRouter.get("/filtered/adverts", getFilteredAdverts);
AdvertRouter.get("/", getAllAdverts);
AdvertRouter.get("/my/adverts", authenticate, hasPermission("getMyServices"),getMyAdverts);
AdvertRouter.get("/:id", getAdvertById);
AdvertRouter.patch("/:id", authenticate, hasPermission("patchService"), patchAdvert);
AdvertRouter.delete("/:id", authenticate, hasPermission("deleteMyService"), deleteMyAdvert);
