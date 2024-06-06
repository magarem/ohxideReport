import { readFiles } from 'h3-formidable';
import fs from "fs";
import path from "node:path";
export default defineEventHandler(async (event) => {
    
    // let req = await readBody(event)
    const { dir } = getQuery(event);
    console.log(dir);
    const { files: { photo: [ { originalFilename, filepath, mimetype } ] } } = await readFiles(event, {
         includeFields: true
    });

    
    console.log('name::::::', originalFilename);
    // const name = files.imgFile.path
    // console.log('name:', photo);
    let imageName = String(Date.now()) + String(Math.round(Math.random() * 10000000))+'.'+mimetype.split('/')[1];
    // let newPath = `${path.join("public", "upload", dir, originalFilename)}.${ mimetype.split('/')[1] }`;
    // let newPath = `${path.join("upload", originalFilename)}`;
    let newPath = path.join("upload", imageName)
    
    
    fs.copyFileSync(filepath, newPath);

    // let image_id = Date.now() + Math.random()

    // const image = await sharp(newPath)
    // .resize(1350) // width=300 & height=150
    // .toFormat('jpg') // convert to JPEG
    // .jpeg({ quality: 85 }) // compress it with a quality level of 80 out of 100
    // .toFile( "public/upload/" + dir + '/' + image_id + '.jpg')

    // fs.unlinkSync(newPath);
    // console.log('delete:', newPath);
    // fs.writeFile('image.png', funnction);
    // fs.writeFile(newPath, image, (err) => { 
    //     if (err) 
    //       console.log(err); 
    //     else { 
    //       console.log("File written successfully\n"); 
    //     } 
    //   });
    // return originalFilename
    return imageName
});