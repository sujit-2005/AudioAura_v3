import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ProductImage from '../common/ProductImage';
import formatCurrency from '../../utils/formatCurrency';
import { getProductImage, getProductImageAlt } from '../../utils/productImages';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
  </svg>
);

const ProductCard = ({ product }) => {
  const displayPrice = product.discountPrice ?? product.price;

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="product-card__image-wrap">
        {product.featured && <span className="product-badge">Featured</span>}
        <ProductImage
          src={getProductImage(product)}
          alt={getProductImageAlt(product)}
        />
      </div>
      <div className="product-card__body">
        <div className="product-card__eyebrow">
          <span>{product.brand}</span>
          <span aria-hidden="true">/</span>
          <span>{product.category}</span>
        </div>
        <h3>
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.shortDescription}</p>
        <div className="product-card__footer">
          <div className="product-price">
            <strong>{formatCurrency(displayPrice)}</strong>
            {product.discountPrice !== null &&
              product.discountPrice !== undefined && (
                <del>{formatCurrency(product.price)}</del>
              )}
          </div>
          <div
            className="product-rating"
            aria-label={`${product.rating} out of 5 stars`}
          >
            <StarIcon />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <Link className="quick-view-link" to={`/products/${product.slug}`}>
          View details
        </Link>
      </div>
    </motion.article>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountPrice: PropTypes.number,
    rating: PropTypes.number.isRequired,
    featured: PropTypes.bool.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        altText: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default ProductCard;
