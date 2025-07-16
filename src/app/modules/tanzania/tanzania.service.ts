// Type definitions
type SubWard = {
     'sub-wards': string[];
};

type Ward = {
     [wardName: string]: SubWard;
};

type District = {
     district: string;
     city: string;
     wards: Ward;
};

type TanzaniaType = {
     [districtName: string]: District;
};

// The data representing the districts, wards, and sub-wards.
export const Tanzania: TanzaniaType = {
     Kigamboni: {
          district: 'Kigamboni',
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
               'Kisarawe II Ward': {
                    'sub-wards': ['Kichangani', 'Kigogo', 'Lingato', 'Madege', 'Mkamba', 'Mwaninga', 'Mwasonga', 'Ngoma Mapinduzi', 'Sharifu', 'Tumaini', 'Vumilia Ukooni'],
               },
               'Mjimwema Ward': {
                    'sub-wards': ['Kibugumo', 'Maweni', 'Mjimwema', 'Ungindoni, Mjimwema'],
               },
               'Pembamnazi Ward': {
                    'sub-wards': [
                         'Buyuni Center',
                         'Chambewa',
                         'Gulubwida',
                         'Kibungo',
                         'Kichangani',
                         'Kwa Morisi',
                         'Mahenge',
                         'Mtimweupe',
                         'Muhimbili',
                         'Nyange',
                         'Pemba Center',
                         'Potea',
                         'Pu Center',
                         'Songani Center',
                         'Tundwi Center',
                    ],
               },
               'Somangila Ward': {
                    'sub-wards': [
                         'Bamba',
                         'Dege',
                         'Kichangani',
                         'Kizani',
                         'Malimbika',
                         'Mbwamaji or Mbuamaji',
                         'Minondo',
                         'Mkwajuni, Somangila',
                         'Mwanzo Mgumu',
                         'Mwera, Somangila',
                         'Sara',
                         'Shirikisho',
                         'Visikini',
                    ],
               },
               'Tungi Ward': {
                    'sub-wards': ['Tungi Ward Police Station', 'Tungi Ward Government Office (Afisa Mtendaji)', 'Tungi Ward Tribunal (Baraza La Kata)'],
               },
               'Vijibweni Ward': {
                    'sub-wards': ['Kibene', 'Kisiwani, Vijibweni', 'Majengo, Vijibweni', 'Mkwajuni, Vijibweni', 'Upendo, Vijibweni', 'Vijibweni, Vijibweni'],
               },
          },
     },
     Kinondoni: {
          district: 'Kinondoni',
          city: 'Kinondoni',
          wards: {
               'Bunju Ward': {
                    'sub-wards': ['Boko', "Bunju 'A'", 'Busihaya', 'Dovya', 'Kilungule', 'Mkoani'],
               },
               'Hananasif Ward': {
                    'sub-wards': ['Hananasif', 'Kawawa', 'Kisutu', 'Mkunguni A', 'Mkunguni B'],
               },
               'Kawe Ward': {
                    'sub-wards': ['Mbezi Beach A', 'Mbezi Beach B', 'Mzimuni', 'Ukwamani'],
               },
               'Kigogo Ward': {
                    'sub-wards': ['Kigogo Kati', 'Kigogo Mbuyuni', 'Kigogo Mkwajuni'],
               },
               'Kijitonyama Ward': {
                    'sub-wards': ['Alimaua A', 'Alimaua B', 'Bwawani', 'Kijitonyama', 'Mpakani A', 'Mpakani B'],
               },
               'Kinondoni Ward': {
                    'sub-wards': ['Ada Estate', 'Kinondoni Mjini', 'Kinondoni Shamba', 'Kumbukumbu', 'Kunduchi', 'Kunduchi Mtongani', 'Kunduchi Pwani', 'Mtongani'],
               },
               'Tegeta Ward': {
                    'sub-wards': ['Tegeta A', 'Tegeta B', 'Ununio', 'Mabwepande', 'Bunju B', 'Kihonzile'],
               },
               'Magomeni Ward': {
                    'sub-wards': ['Magomeni Mapipa', 'Magomeni Mikumi', 'Magomeni Mwembechai', 'Magomeni Suna'],
               },
               'Makumbusho Ward': {
                    'sub-wards': ['Makumbusho A', 'Makumbusho B', 'Makumbusho C', 'Makumbusho D', 'Makumbusho E', 'Makumbusho F'],
               },
               'Mbezi Juu Ward': {
                    'sub-wards': ['Jogoo', 'Mbezi Juu', 'Mbezi Kati', 'Ndumbwi'],
               },
          },
     },
     // Add Temeke and Ilala in the same way as above
};

// Service class to interact with the data
export class TanzaniaService {
     getAllDistricts(): string[] {
          return Object.keys(Tanzania); // Returns all district names
     }

     getWardsByDistrict(district: string): string[] {
          const data = Tanzania[district];
          if (!data) throw new Error('District not found');
          return Object.keys(data.wards); // Returns all wards within a specific district
     }

     getSubWards(district: string, ward: string): string[] {
          const data = Tanzania[district];
          if (!data || !data.wards[ward]) throw new Error('Ward not found');
          return data.wards[ward]['sub-wards']; // Returns sub-wards of a specific ward
     }
}

export const tanzaniaService = new TanzaniaService();
