import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import ProductImage from '../../components/common/ProductImage';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';
import { getProductImage, getProductImageAlt } from '../../utils/productImages';

const CartPage = () => {
  const { cart, cartLoading, removeItem, subtotal, updateItem } = useCart();

  return (
    <motion.main
      className="page-shell utility-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-heading">
        <span className="section-kicker">Your bag</span>
        <h1>Cart</h1>
      </div>

      {cartLoading && <p className="soft-loading">Loading cart...</p>}
      {!cartLoading && cart.items.length === 0 && (
        <motion.div
          className="catalog-state premium-empty-state glass-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="catalog-state__icon" aria-hidden="true">
            0
          </div>
          <h2>Your cart is waiting for its first signal</h2>
          <p>Start with the collection and add products you love.</p>
          <Link className="primary-button" to="/products">
            Shop products
          </Link>
        </motion.div>
      )}

      {cart.items.length > 0 && (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item, index) => {
              const product = item.product;
              const price = product.discountPrice ?? product.price;

              return (
                <motion.article
                  className="cart-item glass-panel"
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <ProductImage
                    src={getProductImage(product)}
                    alt={getProductImageAlt(product)}
                  />
                  <div>
                    <span className="section-kicker">{product.brand}</span>
                    <h2>{product.name}</h2>
                    <strong>{formatCurrency(price)}</strong>
                  </div>
                  <div className="quantity-control">
                    <motion.button
                      aria-label={`Decrease ${product.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() => updateItem(product._id, item.quantity - 1)}
                      type="button"
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <input
                      min="1"
                      onChange={(event) =>
                        updateItem(product._id, Number(event.target.value))
                      }
                      type="number"
                      value={item.quantity}
                    />
                    <motion.button
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() => updateItem(product._id, item.quantity + 1)}
                      type="button"
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                  </div>
                  <button onClick={() => removeItem(product._id)} type="button">
                    Remove
                  </button>
                </motion.article>
              );
            })}
          </div>
          <motion.aside
            className="summary-card glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="section-kicker">Order summary</span>
            <h2>Ready to tune out</h2>
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>Calculated next</strong>
            </div>
            <p>Shipping and tax are calculated during fake checkout.</p>
            <Link className="primary-button wide-button" to="/checkout">
              Checkout
            </Link>
          </motion.aside>
        </div>
      )}
    </motion.main>
  );
};

export default CartPage;
