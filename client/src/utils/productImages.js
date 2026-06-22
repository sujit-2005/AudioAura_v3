const FALLBACK_PRODUCT_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200"><defs><radialGradient id="g" cx="50%" cy="34%" r="60%"><stop offset="0%" stop-color="%23242927"/><stop offset="55%" stop-color="%23121514"/><stop offset="100%" stop-color="%23070807"/></radialGradient><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23b7ff37" stop-opacity=".85"/><stop offset="100%" stop-color="%23e9ece8" stop-opacity=".18"/></linearGradient></defs><rect width="1200" height="1200" fill="url(%23g)"/><circle cx="600" cy="560" r="270" fill="none" stroke="url(%23a)" stroke-width="22"/><path d="M365 610v-82c0-130 105-235 235-235s235 105 235 235v82" fill="none" stroke="%23e9ece8" stroke-width="34" stroke-linecap="round"/><rect x="290" y="590" width="150" height="245" rx="72" fill="%23b7ff37"/><rect x="760" y="590" width="150" height="245" rx="72" fill="%23b7ff37"/><path d="M448 845c38 44 91 66 152 66s114-22 152-66" fill="none" stroke="%23e9ece8" stroke-width="28" stroke-linecap="round"/></svg>';

const getProductImage = (product, index = 0) =>
  product?.images?.[index]?.url || product?.image || FALLBACK_PRODUCT_IMAGE;

const getProductImageAlt = (product, index = 0) =>
  product?.images?.[index]?.altText || product?.name || 'AudioAura product image';

export { FALLBACK_PRODUCT_IMAGE, getProductImage, getProductImageAlt };
