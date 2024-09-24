import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { verifyToken } from "./user";
import { UserModel } from "../models/user";
import { ProductErrors, UserErrors } from "../error";

const router = Router();

router.get("/", verifyToken, async (_, res: Response) => {
  try {
    const product = await ProductModel.find({});
    res.json({ product });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/checkout", verifyToken, async (req: Request, res: Response) => {
  const { customerID, cartItems } = req.body;

  // Validate that cartItems and customerID are provided
  if (!customerID || !cartItems || Object.keys(cartItems).length === 0) {
    return res
      .status(400)
      .json({ error: "Customer ID and cart items are required" });
  }

  try {
    // Find the user by customer ID
    const user = await UserModel.findById(customerID);
    if (!user) {
      return res.status(400).json({ error: UserErrors.NO_USER_FOUND });
    }

    // Get product IDs from cartItems
    const productIDs = Object.keys(cartItems);

    // Fetch the products from the database
    const products = await ProductModel.find({ _id: { $in: productIDs } });
    if (products.length !== productIDs.length) {
      return res.status(400).json({ error: ProductErrors.NO_PRODUCT_FOUND });
    }

    // Calculate the total price and check stock availability
    let totalPrice = 0;
    for (const item in cartItems) {
      const product = products.find((product) => String(product._id) === item);
      if (!product) {
        return res.status(400).json({ error: ProductErrors.NO_PRODUCT_FOUND });
      }

      // Check if enough stock is available
      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({
          error: `${ProductErrors.NOT_ENOUGH_STOCK} for ${product.productName}`,
        });
      }

      // Calculate the total price (price * quantity)
      totalPrice += product.price * cartItems[item];
    }

    // Check if the user has enough available money
    if (user.availableMoney < totalPrice) {
      return res.status(400).json({ error: ProductErrors.NOT_ENOUGH_MONEY });
    }

    // Deduct the total price from the user's available money
    user.availableMoney -= totalPrice;

    // Add purchased items to user's purchased list
    user.purchasedItems.push(...productIDs);

    // Save user data
    await user.save();

    // Update stock quantities for purchased products
    for (const item in cartItems) {
      await ProductModel.updateOne(
        { _id: item },
        { $inc: { stockQuantity: -cartItems[item] } }
      );
    }

    // Respond with the purchased items
    res.json({
      message: "Checkout successful",
      purchasedItems: user.purchasedItems,
    });
  } catch (error) {
    res.status(400).json({ error: "Checkout failed", details: error });
  }
});

export { router as productRouter };
