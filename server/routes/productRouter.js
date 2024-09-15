import express from 'express';
import { getProducts,
         createProduct,
         updateProduct,
         deleteProduct,
         getProductImageUrl,
         getProductsByRoom,
         //patchProductImages,
         getProductImageByIndex,
         getAllProductImages,
         getProductById
         } from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getProducts); //Here we access all products in the database

router.post('/products', createProduct); //Here is to create new products

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);

router.get('/products/:id', getProductById); //To see One product

//for Images

router.get('/products/:id/image-urls', getProductImageUrl);

router.get('/products/:productId/images/:category/:index', getProductImageByIndex);// Here we can see the image by index in images array(the image come transformed from cloudinary)

router.get('/products/:productId/all-images', getAllProductImages);

router.get('/products/room/:room', getProductsByRoom);

//router.patch('/products/:id/images', patchProductImage); //To add image to an existing product


export default router;