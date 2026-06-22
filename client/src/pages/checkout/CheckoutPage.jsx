import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createOrder } from '../../api/orderService';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';

const checkoutSteps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, loadCart, subtotal } = useCart();
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const completedFields = Object.values(shippingAddress).filter(Boolean).length;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await createOrder({ shippingAddress, paymentMethod: 'Fake Card' });
      await loadCart();
      navigate('/orders');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to place order');
    }
  };

  return (
    <motion.main
      className="page-shell utility-page checkout-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-heading">
        <span className="section-kicker">Fake checkout</span>
        <h1>Place order</h1>
      </div>

      <div className="checkout-progress glass-panel" aria-label="Checkout progress">
        {checkoutSteps.map((step, index) => (
          <div className={index === 0 ? 'active' : ''} key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      <div className="cart-layout">
        <motion.form
          className="panel-form glass-panel"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="section-kicker">Step 1 / Shipping profile</span>
          <h2>Where should the sound arrive?</h2>
          {error && <p className="form-error">{error}</p>}
          {Object.entries(shippingAddress).map(([key, value]) => (
            <label key={key}>
              {key.replace(/([A-Z])/g, ' $1')}
              <input
                onChange={(event) =>
                  setShippingAddress({
                    ...shippingAddress,
                    [key]: event.target.value,
                  })
                }
                required
                type={key === 'email' ? 'email' : 'text'}
                value={value}
              />
            </label>
          ))}
          <div className="form-completion">
            <span>Profile completion</span>
            <strong>{completedFields}/6</strong>
          </div>
          <button
            className="primary-button wide-button"
            disabled={cart.items.length === 0}
            type="submit"
          >
            Place fake order
          </button>
        </motion.form>
        <motion.aside
          className="summary-card glass-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="section-kicker">Review</span>
          <h2>Order signal</h2>
          <div>
            <span>Items</span>
            <strong>{cart.items.length}</strong>
          </div>
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>Fake Card</strong>
          </div>
        </motion.aside>
      </div>
    </motion.main>
  );
};

export default CheckoutPage;
