import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { FALLBACK_PRODUCT_IMAGE } from '../../utils/productImages';

const ProductImage = ({ alt, className = '', loading = 'lazy', src }) => {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_PRODUCT_IMAGE);

  useEffect(() => {
    setCurrentSrc(src || FALLBACK_PRODUCT_IMAGE);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== FALLBACK_PRODUCT_IMAGE) {
      setCurrentSrc(FALLBACK_PRODUCT_IMAGE);
    }
  };

  return (
    <img
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      src={currentSrc || FALLBACK_PRODUCT_IMAGE}
    />
  );
};

ProductImage.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['eager', 'lazy']),
  src: PropTypes.string,
};

export default ProductImage;
