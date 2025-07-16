import { Request, Response } from 'express';
import { tanzaniaService } from './tanzania.service';

// Define the parameter structure (district, city, ward)
interface Params {
     district: string;
     city: string;
     ward: string;
}

// Get all districts
export const getDistricts = (req: Request, res: Response) => {
     try {
          const districts = tanzaniaService.getAllDistricts();
          res.json(districts); // Returns a list of districts
     } catch (error: any) {
          res.status(500).json({ message: 'Error fetching districts' });
     }
};

// Get all cities in a district
export const getCities = (req: Request, res: Response) => {
     try {
          const { district } = req.params;
          const cities = tanzaniaService.getCitiesByDistrict(district);
          res.json(cities); // Returns all cities within a district
     } catch (error: any) {
          res.status(404).json({ message: `District   not found` });
     }
};

// Get all wards of a specific city in a district
export const getWards = (req: Request<Params>, res: Response) => {
     try {
          const { district, city } = req.params;
          const wards = tanzaniaService.getWardsByCity(district, city);
          res.json(wards); // Returns all wards in the city of a district
     } catch (error: any) {
          res.status(404).json({ message: `City  not found in district  ` });
     }
};

// Get all sub-wards of a specific ward in a city of a district
export const getSubWards = (req: Request<Params>, res: Response) => {
     try {
          const { district, city, ward } = req.params;
          const subWards = tanzaniaService.getSubWards(district, city, ward);
          res.json(subWards); // Returns sub-wards for a specific ward in the city of the district
     } catch (error: any) {
          res.status(404).json({ message: `Ward   not found in city   of district  ` });
     }
};
