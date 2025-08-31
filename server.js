import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const productsFilePath = path.join(process.cwd(), "src/data/products.json");

// Add product to products.json
app.post("/api/products", (req, res) => {
  const newProduct = req.body;

  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read products file" });
    }

    let products = JSON.parse(data);

    // Ensure brand array exists
    if (!products[newProduct.brandId]) {
      products[newProduct.brandId] = [];
    }

    // Push product
    products[newProduct.brandId].push(newProduct);

    // Save back to file
    fs.writeFile(
      productsFilePath,
      JSON.stringify(products, null, 2),
      "utf8",
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to save product" });
        }
        res.json({ success: true, product: newProduct });
      }
    );
  });
});

// Get products by brand
app.get("/api/products/brand/:brandId", (req, res) => {
  const brandId = req.params.brandId;

  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read products file" });
    }

    let products = JSON.parse(data);
    res.json(products[brandId] || []);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
