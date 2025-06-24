import { User } from '../models/user_model.js';
import { Advert } from '../models/advert_model.js';

// export const getDashboard = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalVendors = await User.countDocuments({ role: 'vendor' });
//     const totalCustomers = await User.countDocuments({ role: 'customer' });

//     const totalAdverts = await Advert.countDocuments();

//     const advertsPerCategory = await Advert.aggregate([
//       {
//         $group: {
//           _id: '$category',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const recentAdverts = await Advert.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'firstName lastName email');

//     res.json({
//       summary: {
//         totalUsers,
//         totalVendors,
//         totalCustomers,
//         totalAdverts
//       },
//       categoryStats: advertsPerCategory,
//       recentAdverts
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to load dashboard' });
//   }
// };



export const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied. Vendors only.' });
    }

    //  Only adverts posted by this vendor
    const myAdverts = await Advert.find({ user: vendorId });

    const MytotalAdverts = myAdverts.length;

    //  breakdown by category
    const myAdvertsPerCategory = await Advert.aggregate([
      { $match: { user: vendor.id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      vendor: {
        name: `${vendor.firstName} ${vendor.lastName}`,
        email: vendor.email,
        role: vendor.role
      },
      stats: {
        MytotalAdverts,
        myAdvertsPerCategory
      },
      myAdverts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load vendor dashboard' });
  }
};


