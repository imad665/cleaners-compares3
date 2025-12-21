import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

const PRODUCTS_FILE = path.join(process.cwd(), "public", "allProducts.json");

export async function copyProductsToFile() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const products = await prisma.product.findMany({ select: { title: true } });
    fs.writeFileSync(
      PRODUCTS_FILE,
      JSON.stringify(products.map((p) => p.title), null, 2)
    );
    console.log("Products saved to public/allProducts.json");
  }

  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
}

export async function removeNonRealProducts() {
  try {
    const productsToDelete = [
      "New Machine Item",
      "Bzhshsh",
      "Test Machine",
      "Laundry",
      "New Washing Machine",
      "Machine 1",
      "Cloth Machines",
      "New Sundry Item",
      "ironing ",
      "Dryer",
      "Machines ",
      "test part",
      "New Parts Item",
      "Parts",
      "All Steam Iron"
    ];

    // Delete each product by name
    const deletePromises = productsToDelete.map(productName => 
      prisma.product.deleteMany({
        where: {
          title: productName.trim() // Trim whitespace for safety
        }
      })
    );

    const results = await Promise.all(deletePromises);
    const totalDeleted = results.reduce((sum, result) => sum + result.count, 0);
    
    console.log(`Successfully deleted ${totalDeleted} non-real products`);
    
  } catch (error) {
    console.error('Error deleting products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

 