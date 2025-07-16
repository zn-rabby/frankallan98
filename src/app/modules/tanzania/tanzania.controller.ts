import { Request, Response } from 'express';
import { tanzaniaService } from './tanzania.service';

// Define the parameter structure (district, ward)
interface Params {
     district: string;
     ward: string;
}

// Get all districts
export const getDistricts = (req: Request, res: Response) => {
     try {
          const districts = tanzaniaService.getAllDistricts();
          res.json(districts);
     } catch (error: any) {
          res.status(500).json({ message: 'Error fetching districts' });
     }
};

// Get all wards of a specific district
export const getWards = (req: Request<Params>, res: Response) => {
     try {
          const { district } = req.params; // Now TypeScript understands `district` here
          const wards = tanzaniaService.getWardsByDistrict(district);
          res.json(wards);
     } catch (error: any) {
          res.status(404).json({ message: `District  not found` });
     }
};

// Get all sub-wards of a specific ward in a district
export const getSubWards = (req: Request<Params>, res: Response) => {
     try {
          const { district, ward } = req.params; // Now TypeScript understands both `district` and `ward`
          const subWards = tanzaniaService.getSubWards(district, ward);
          res.json(subWards);
     } catch (error: any) {
          res.status(404).json({ message: `Ward   not found in district  ` });
     }
};
