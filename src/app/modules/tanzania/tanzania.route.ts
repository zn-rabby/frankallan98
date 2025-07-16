import express from 'express';
import { getDistricts, getCities, getWards, getSubWards } from './tanzania.controller';

const router = express.Router();

// Route to get all districts
router.get('/districts', getDistricts); // ➤ GET all districts

// Route to get all cities in a specific district
router.get('/districts/:district/city', getCities); // ➤ GET cities for a district

// Route to get wards in a city of a district
router.get('/districts/:district/city/:city/wards', getWards); // ➤ GET wards in a city for a district

// Route to get sub-wards of a specific ward in a city of a district
router.get('/districts/:district/city/:city/wards/:ward/sub-wards', getSubWards); // ➤ GET sub-wards for a ward

// Export the routes
export const TanzaniaRoutes = router;
