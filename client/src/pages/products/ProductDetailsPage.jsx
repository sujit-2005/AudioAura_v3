import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  getProductBySlug,
  getRelatedProducts,
} from '../../api/productService';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import ProductImage from '../../components/common/ProductImage';
import ProductCard from '../../components/product/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';
import { getProductImage, getProductImageAlt } from '../../utils/productImages';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const [productResponse, relatedResponse] = await Promise.all([
          getProductBySlug(slug, controller.signal),
          getRelatedProducts(slug, controller.signal),
        ]);

        setProduct(productResponse.data);
        setRelatedProducts(relatedResponse.data);
        setActiveImage(0);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError(
            requestError.response?.data?.message || 'Unable to load product',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => controller.abort();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }

    try {
      await addItem(product._id, 1);
      setCartMessage('Added to cart');
    } catch (requestError) {
      setCartMessage(
        requestError.response?.data?.message || 'Unable to add item',
      );
    }
  };

  if (loading) {
    return (
      <main className="page-shell detail-page">
        <LoadingState />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page-shell detail-page">
        <ErrorState message={error || 'Product not found'} />
      </main>
    );
  }

  const displayPrice = product.discountPrice ?? product.price;
  const currentImage = product.images?.[activeImage] || product.images?.[0];
  const productSpecs = product.specifications || [];

  return (
    <motion.main
      className="page-shell detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Link className="text-link" to="/products">
        Back to products
      </Link>

      <section className="product-detail">
        <motion.div
          className="product-gallery glass-panel"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="product-gallery__main">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage?.url}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductImage
                  src={currentImage?.url || getProductImage(product)}
                  alt={currentImage?.altText || getProductImageAlt(product)}
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="product-gallery__thumbs">
            {product.images.map((image, index) => (
              <motion.button
                className={index === activeImage ? 'active' : ''}
                key={image.url}
                onClick={() => setActiveImage(index)}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
              >
                <ProductImage src={image.url} alt={image.altText} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="product-info-panel glass-panel"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-kicker">
            {product.brand} / {product.category}
          </span>
          <h1>{product.name}</h1>
          <p>{product.fullDescription}</p>
          <div className="detail-price-row">
            <strong>{formatCurrency(displayPrice)}</strong>
            {product.discountPrice && <del>{formatCurrency(product.price)}</del>}
          </div>
          <div className="detail-meta">
            <span>Rating {product.rating.toFixed(1)} / 5</span>
            <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <div className="purchase-perks">
            <span>Free premium shipping</span>
            <span>30-day listening trial</span>
            <span>Secure fake checkout</span>
          </div>
          <motion.button
            className="primary-button wide-button"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            type="button"
            whileHover={{ scale: product.stock === 0 ? 1 : 1.015 }}
            whileTap={{ scale: product.stock === 0 ? 1 : 0.98 }}
          >
            Add to cart
          </motion.button>
          <AnimatePresence>
            {cartMessage && (
              <motion.p
                className="form-message"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {cartMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <motion.section
        className="spec-section"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-heading">
          <span className="section-kicker">Details</span>
          <h2>Specifications</h2>
        </div>
        <div className="spec-grid">
          {productSpecs.map((specification, index) => (
            <motion.div
              className="spec-row glass-panel"
              key={specification.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <span>{specification.name}</span>
              <strong>{specification.value}</strong>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="modern-review-section">
        <div className="section-heading">
          <span className="section-kicker">Reviews</span>
          <h2>Listener notes</h2>
        </div>
        <div className="reviews-grid">
          <motion.article className="glass-panel" whileHover={{ y: -5 }}>
            <p>Precise, immersive, and controlled across long listening sessions.</p>
            <strong>Verified listener</strong>
          </motion.article>
          <motion.article className="glass-panel" whileHover={{ y: -5 }}>
            <p>Beautiful material feel with a soundstage that reads unmistakably premium.</p>
            <strong>Studio user</strong>
          </motion.article>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="home-section">
          <div className="section-heading">
            <span className="section-kicker">Related</span>
            <h2>More in {product.category}</h2>
          </div>
          <div className="product-carousel">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </motion.main>
  );
};

export default ProductDetailsPage;
