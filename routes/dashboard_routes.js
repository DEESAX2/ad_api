import { Router } from 'express';
import { getDashboard, getVendorDashboard } from '../controllers/dashboard_controller.js';
import { authenticate, hasPermission } from '../middlewares/auth.js';


export const dashboardRouter = Router();

// dashboardRouter.get('/all', getDashboard);
dashboardRouter.get('/my/dashboard',authenticate, hasPermission('getMydashboard'), getVendorDashboard);


