const CATEGORIES = [
  'Headphones',
  'Earbuds',
  'Speakers',
  'Soundbars',
  'DACs',
  'Amplifiers',
  'Microphones',
  'Accessories',
];

const BRANDS = [
  'Apple',
  'Audio-Technica',
  'Bose',
  'FiiO',
  'JBL',
  'Marshall',
  'Sony',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' },
];

const RATING_OPTIONS = [
  { value: '4', label: '4 stars & up' },
  { value: '3', label: '3 stars & up' },
  { value: '2', label: '2 stars & up' },
];

export { BRANDS, CATEGORIES, RATING_OPTIONS, SORT_OPTIONS };
