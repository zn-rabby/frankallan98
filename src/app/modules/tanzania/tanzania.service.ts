// Type definitions
type SubWard = {
     'sub-wards': string[]; // List of sub-wards for a specific ward
};

type Ward = {
     [wardName: string]: SubWard; // Each ward has a list of sub-wards
};

type City = {
     city: string;
     wards: Ward;
};

type District = {
     district: string;
     cities: {
          [cityName: string]: City; // Each city in the district with its wards and sub-wards
     };
};

type TanzaniaType = {
     [districtName: string]: District; // Each district maps to a district object
};

// The data representing the districts, wards, and sub-wards.
// The data representing the districts, cities, wards, and sub-wards.
export const Tanzania: TanzaniaType = {
     Kigamboni: {
          district: 'Kigamboni',
          cities: {
               Kigamboni: {
                    city: 'Kigamboni',
                    wards: {
                         'Kigamboni Ward': {
                              'sub-wards': ['Ferry', 'Kigamboni', 'Tuamoyo'],
                         },
                         'Kibada Ward': {
                              'sub-wards': ['Kichangani', 'Kifurukwe', 'Kiziza', 'Nyakwale', 'Sokoni', 'Uvumba'],
                         },
                         'Kimbiji Ward': {
                              'sub-wards': ['Golani', 'Kijaka', 'Kizito Huonjwa', 'Kwa Chale', 'Mikenge', 'Ngobanya'],
                         },
                         // Add more wards...
                    },
               },
          },
     },
     Kinondoni: {
          district: 'Kinondoni',
          cities: {
               Kinondoni: {
                    city: 'Kinondoni',
                    wards: {
                         'Bunju Ward': {
                              'sub-wards': ['Boko', "Bunju 'A'", 'Busihaya', 'Dovya', 'Kilungule', 'Mkoani'],
                         },
                         // Add more wards...
                    },
               },
          },
     },
     // Add other districts with similar structure...
};

// Service class to interact with the Tanzania data
export class TanzaniaService {
     // Fetch all district names
     getAllDistricts(): string[] {
          return Object.keys(Tanzania); // Returns all district names
     }

     // Fetch all cities in a specific district
     getCitiesByDistrict(district: string): string[] {
          const data = Tanzania[district];
          if (!data) throw new Error('District not found');
          return Object.keys(data.cities); // Returns all cities in a specific district
     }

     // Fetch wards of a specific city in a district
     getWardsByCity(district: string, city: string): string[] {
          const data = Tanzania[district]?.cities[city];
          if (!data) throw new Error('City not found');
          return Object.keys(data.wards); // Returns all wards in the city of the district
     }

     // Fetch sub-wards of a specific ward in a city of a district
     getSubWards(district: string, city: string, ward: string): string[] {
          const data = Tanzania[district]?.cities[city]?.wards[ward];
          if (!data) throw new Error('Ward not found');
          return data['sub-wards']; // Returns sub-wards of a specific ward in a city
     }
}

// Export the service instance
export const tanzaniaService = new TanzaniaService();
