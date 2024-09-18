import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
//import Set from './models/productSetModels.js';
import cloudinary from './config/cloudinaryConfig.js';
import {products} from './data/products.js';
//import {sets} from './data/sets.js';
import path from 'path';
dotenv.config();

// With this function we upload the objects that create in -data/products.js- and these in turn obtain the images
// from the ProductImage folder -using path
// First, the images are sent to cloudinary to obtain the URLs  and saved together with the object in the database.

mongoose.connect(process.env.CONNECTION_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));
 
async function uploadImage(imagePath) {
  try {
      const result = await cloudinary.uploader.upload(imagePath);
      return { url: result.url, public_id: result.public_id };
  } catch (error) {
      console.error(`Error uploading image ${imagePath}:`, error);
      return null;
  }
}
async function createProducts() {
    try{
        //this line is for delete the products and populate again
        await Product.deleteMany({}); 

        for (const product of products) {
          const imageUploads = {
            product: await Promise.all(product.images.product.map(path => uploadImage(path))),
            contextual: await Promise.all(product.images.contextual.map(path => uploadImage(path))),
            transparent: await Promise.all(product.images.transparent.map(path => uploadImage(path)))
        };

          const uploadedImages = {
            product: await Promise.all(imageUploads.product),
            contextual: await Promise.all(imageUploads.contextual),
            transparent: await Promise.all(imageUploads.transparent)
          };

          // Filtrar las imágenes que se subieron correctamente
          const imagesWithUrls = {
            product: uploadedImages.product.filter(img => img !== null),
            contextual: uploadedImages.contextual.filter(img => img !== null),
            transparent: uploadedImages.transparent.filter(img => img !== null)
          };
          
          const newProduct = new Product({
                ...product,
                images: imagesWithUrls
          });
            await newProduct.save();
            console.log('Producto guardado:', newProduct.name);
        }
    } catch (error) {
        console.error('Error creating products:', error);
   }
}
// Llama a la función para crear productos

createProducts().then(() => {
  console.log('Seeding completed');
  mongoose.connection.close();
});
