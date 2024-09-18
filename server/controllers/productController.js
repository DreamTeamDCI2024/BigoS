import path from 'path';
import { promises as fs } from 'fs';
import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinaryConfig.js';

export async function getProducts(req, res) {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

export async function createProduct(req, res) {
    try {
        const { name, description, price, categories, dimensions, materials, room, stock, featured } = req.body;
        
        //Process the images and send to cloudinary- match the url with the descriptions
        const imageUploads = {
            product: req.files.product ? req.files.product.map(file => cloudinary.uploader.upload(file.path)) : [],
            contextual: req.files.contextual ? req.files.contextual.map(file => cloudinary.uploader.upload(file.path)) : [],
            transparent: req.files.transparent ? req.files.transparent.map(file => cloudinary.uploader.upload(file.path)) : []
        };

        const uploadedImages = {
            product: await Promise.all(imageUploads.product),
            contextual: await Promise.all(imageUploads.contextual),
            transparent: await Promise.all(imageUploads.transparent)
        };

        const images = {
            product: uploadedImages.product.map(result => ({ url: result.url, public_id: result.public_id })),
            contextual: uploadedImages.contextual.map(result => ({ url: result.url, public_id: result.public_id })),
            transparent: uploadedImages.transparent.map(result => ({ url: result.url, public_id: result.public_id }))
        };
        const newProduct = new Product({
            name,
            description,
            price,
            categories,
            dimensions,
            materials,
            room,
            images,
            stock,
            featured
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product: ' + error.message });
    }
}

export async function updateProduct(req, res) {
    const { id } = req.params; 
    const { name, description, price, categories, materials, room, stock, featured, images } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (req.files) {
            const imageUploads = {
                product: req.files.product ? req.files.product.map(file => cloudinary.uploader.upload(file.path)) : [],
                contextual: req.files.contextual ? req.files.contextual.map(file => cloudinary.uploader.upload(file.path)) : [],
                transparent: req.files.transparent ? req.files.transparent.map(file => cloudinary.uploader.upload(file.path)) : []
            };

            const uploadedImages = {
                product: await Promise.all(imageUploads.product),
                contextual: await Promise.all(imageUploads.contextual),
                transparent: await Promise.all(imageUploads.transparent)
            };
            // Actualizar imágenes solo si se proporcionaron nuevas
            if (uploadedImages.product.length > 0) {
                product.images.product = uploadedImages.product.map(result => ({ url: result.url, public_id: result.public_id }));
            }
            if (uploadedImages.contextual.length > 0) {
                product.images.contextual = uploadedImages.contextual.map(result => ({ url: result.url, public_id: result.public_id }));
            }
            if (uploadedImages.transparent.length > 0) {
                product.images.transparent = uploadedImages.transparent.map(result => ({ url: result.url, public_id: result.public_id }));
            }
        }
        // update the props of products
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.categories = categories || product.categories;
        product.materials = materials || product.materials;
        product.room = room || product.room;
        product.stock = stock !== undefined ? stock : product.stock;
        product.featured = featured !== undefined ? featured : product.featured;
        
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product: ' + error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        //delete images from cloudinary
        const deletePromises = [];
        for (const category in product.images) {
            product.images[category].forEach(image => {
                if (image.public_id) {
                    deletePromises.push(cloudinary.uploader.destroy(image.public_id));
                }
            });
        }
        await Promise.all(deletePromises);

        //delete product from mongo
        await Product.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Product and associated images deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getProductImageUrl(req, res) {
    try {
        const product = await Product.findById(req.params.id).select('images');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            product: product.images.product.map(img => img.url),
            contextual: product.images.contextual.map(img => img.url),
            transparent: product.images.transparent.map(img => img.url)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function patchProductImage(req, res) {
    const { images } = req.body; 
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // uploading the images to cloudinary and storen the urls in db
        const imageUploads = images.map(async image => {
            if (typeof image.path !== 'string') {
                throw new Error(`Invalid path: ${image.path}`);
            }
            const imagePath = path.resolve('..', image.path);
            //check if exist... -the file
            try {
                await fs.access(imagePath);
            } catch {
                throw new Error(`File not found: ${imagePath}`);
            }

            const result = await cloudinary.uploader.upload(imagePath); 
            return {
                url: result.url,
                description: image.description
            };
        });
        const imageUrls = await Promise.all(imageUploads);
        //Adding new images to the imageArray
        product.images.push(...imageUrls);
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function applyTransformations(url, transformations) {
    const baseUrl = url.split('/upload/');
    const transformedUrl = `${baseUrl[0]}/upload/${transformations}/${baseUrl[1]}`;
    return transformedUrl;
}

export async function getProductImageByIndex(req, res) {
    try {
        const { productId, category, index } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!['product', 'contextual', 'transparent'].includes(category)) {
            return res.status(400).json({ message: 'Invalid image category' });
        }

        const imageIndex = parseInt(index, 10);
        if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= product.images[category].length) {
            return res.status(404).json({ message: 'Image index out of bounds' });
        }

        const image = product.images[category][imageIndex];
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const transformations = 'w_400,h_400,c_fit'; // we can use c_fit or c_fill
        const transformedImageUrl = applyTransformations(image.url, transformations);
        res.redirect(transformedImageUrl);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving image: ' + error.message });
    }
}
export async function getAllProductImages(req, res) {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const transformations = 'w_400,h_400,c_fit';
        const transformedImages = {
            product: product.images.product.map(img => applyTransformations(img.url, transformations)),
            contextual: product.images.contextual.map(img => applyTransformations(img.url, transformations)),
            transparent: product.images.transparent.map(img => applyTransformations(img.url, transformations))
        };

        res.json(transformedImages);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving images: ' + error.message });
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving product: ' + error.message });
    }
}

export async function getProductsByRoom(req, res) {
    try {
      const { room } = req.params;
      const validRooms = ['LivingRoom', 'BedRoom', 'BathRoom', 'Balcony'];
      
      if (!validRooms.includes(room)) {
        return res.status(400).json({ error: 'Valor de room inválido' });
      }
      
      const products = await Product.find({ room });
      
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error internal' });
    }
  }