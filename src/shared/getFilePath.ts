export type IFolderName = 'images' | 'image' | 'license' | 'driverLicense' | 'insurance' | 'permits' | 'banner' | 'logo' | 'audio' | 'video' | 'document' | 'thumbnail' | 'others';

//single file
export const getSingleFilePath = (files: any, folderName: IFolderName) => {
     const fileField = files && files[folderName];
     if (fileField && Array.isArray(fileField) && fileField.length > 0) {
          return `/${folderName}/${fileField[0].filename}`;
     }

     return undefined;
};

//multiple files
export const getMultipleFilesPath = (files: any, folderName: IFolderName) => {
     const folderFiles = files && files[folderName];
     if (folderFiles) {
          if (Array.isArray(folderFiles)) {
               return folderFiles.map((file: any) => `/${folderName}/${file.filename}`);
          }
     }

     return undefined;
};
