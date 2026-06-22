import { motion } from 'framer-motion';

const LoadingState = () => (
  <div className="product-grid" aria-label="Loading products" aria-busy="true">
    {Array.from({ length: 6 }, (_, index) => (
      <motion.div
        className="product-skeleton"
        key={index}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
      >
        <div className="product-skeleton__image" />
        <div className="product-skeleton__line product-skeleton__line--small" />
        <div className="product-skeleton__line" />
        <div className="product-skeleton__line product-skeleton__line--short" />
      </motion.div>
    ))}
  </div>
);

export default LoadingState;
