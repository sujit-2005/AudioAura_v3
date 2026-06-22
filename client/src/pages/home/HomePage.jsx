import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import ProductImage from '../../components/common/ProductImage';
import ProductCard from '../../components/product/ProductCard';
import { getProducts } from '../../api/productService';
import { getProductImage, getProductImageAlt } from '../../utils/productImages';

const categories = [
  'Headphones',
  'Earbuds',
  'Speakers',
  'Soundbars',
  'DACs',
  'Amplifiers',
  'Microphones',
  'Accessories',
];

const features = [
  ['Aura tuned', 'Every product is selected for spatial detail, low fatigue, and tactile everyday control.'],
  ['Future ready', 'Wireless, wired, studio, and living-room systems built around modern listening rituals.'],
  ['Material first', 'Matte finishes, precision controls, clean silhouettes, and long-service ownership.'],
];

const reviews = [
  ['Mira K.', 'The first store that made high-end audio feel calm, visual, and easy to compare.'],
  ['Dev R.', 'The product pages feel like a listening room. Fast, polished, and very premium.'],
  ['Ana S.', 'AudioAura helped me find headphones that looked as good as they sounded.'],
];

const sectionMotion = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    getProducts({ sort: 'rating_desc', limit: 4 })
      .then((response) => setBestSellers(response.data))
      .catch(() => setBestSellers([]));
  }, []);

  const featuredProduct = useMemo(
    () => bestSellers.find((product) => product.featured) || bestSellers[0],
    [bestSellers],
  );

  return (
    <>
      <section className="home-hero v2-hero">
        <div className="hero-gradient" />
        <div className="particle-field" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} style={{ '--i': index }} />
          ))}
        </div>
        <div className="home-hero__content page-shell">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-kicker">AudioAura V2</span>
            <h1>Future sound, engineered for aura.</h1>
            <p>
              Premium audio technology with cinematic clarity, sculptural
              hardware, and a quieter kind of luxury.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" to="/products">
                Explore devices
              </Link>
              <Link className="secondary-button" to="#why-audioaura">
                Why AudioAura
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="hero-product"
            initial={{ opacity: 0, scale: 0.92, y: 42 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-product__halo" />
            <ProductImage
              src={getProductImage(featuredProduct)}
              alt={getProductImageAlt(featuredProduct)}
              loading="eager"
            />
          </motion.div>
        </div>
        <a className="scroll-indicator" href="#best-sellers" aria-label="Scroll to best sellers">
          <span />
        </a>
      </section>

      <motion.section
        className="page-shell home-section"
        id="best-sellers"
        variants={sectionMotion}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <div className="section-heading">
          <span className="section-kicker">Best sellers</span>
          <h2>Objects of obsession</h2>
        </div>
        <div className="product-carousel">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </motion.section>

      <motion.section
        className="page-shell home-section"
        variants={sectionMotion}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <div className="section-heading">
          <span className="section-kicker">Browse</span>
          <h2>Choose your signal path</h2>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
              className="category-tile"
              to={`/products?category=${encodeURIComponent(category)}`}
              >
                <span>{category}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="benefits-section" id="why-audioaura">
        <div className="page-shell">
          <div className="section-heading">
            <span className="section-kicker">Why AudioAura</span>
            <h2>Luxury is quieter when the engineering is louder.</h2>
          </div>
          <div className="benefits-grid">
            {features.map(([title, body], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="feature-icon">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {featuredProduct && (
        <section className="page-shell home-section featured-product-section">
          <motion.div
            className="featured-product"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65 }}
          >
            <div>
              <span className="section-kicker">Featured product</span>
              <h2>{featuredProduct.name}</h2>
              <p>{featuredProduct.shortDescription}</p>
              <Link className="primary-button" to={`/products/${featuredProduct.slug}`}>
                View product
              </Link>
            </div>
            <ProductImage
              src={getProductImage(featuredProduct)}
              alt={getProductImageAlt(featuredProduct)}
            />
          </motion.div>
        </section>
      )}

      <section className="page-shell home-section reviews-section">
        <div className="section-heading">
          <span className="section-kicker">Customer reviews</span>
          <h2>Signal from the listening room</h2>
        </div>
        <div className="reviews-grid">
          {reviews.map(([name, quote]) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p>{quote}</p>
              <strong>{name}</strong>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="page-shell newsletter-section">
        <span className="section-kicker">Stay tuned</span>
        <h2>Get product drops, studio notes, and private releases.</h2>
        <form>
          <input type="email" placeholder="you@audioaura.com" aria-label="Email" />
          <button className="primary-button" type="submit">
            Join
          </button>
        </form>
      </section>

      <footer className="premium-footer">
        <div className="page-shell">
          <strong>AudioAura</strong>
          <span>Graphite audio systems for future listening.</span>
          <Link to="/products">Shop collection</Link>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
