import express from 'express';
import { getDistricts, getWards, getSubWards } from './tanzania.controller';

const router = express.Router();

// Route to get all districts
router.get('/districts', getDistricts); // ➤ GET all districts

// Route to get wards for a specific district
router.get('/districts/:district/wards', getWards); // ➤ GET wards for a district

// Route to get sub-wards for a specific ward in a district
router.get('/districts/:district/wards/:ward/sub-wards', getSubWards); // ➤ GET sub-wards

export const TanzaniaRoutes = router;
