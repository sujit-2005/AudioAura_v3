const products = [
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    brand: 'Sony',
    category: 'Headphones',
    shortDescription:
      'Premium wireless headphones with industry-leading noise cancellation.',
    fullDescription:
      'The Sony WH-1000XM5 combines adaptive noise cancellation, detailed wireless sound, and lightweight comfort for focused listening at home, at work, or while travelling.',
    price: 399.99,
    discountPrice: 349.99,
    stock: 24,
    rating: 4.8,
    images: [
      {
        url: 'https://media.4rgos.it/i/Argos/2847319_R_Z001A?h=440&qlt=70&w=750',
        altText: 'Sony WH-1000XM5 wireless headphones in black',
      },
    ],
    specifications: [
      { name: 'Connectivity', value: 'Bluetooth 5.2, 3.5 mm' },
      { name: 'Battery life', value: 'Up to 30 hours' },
      { name: 'Weight', value: '250 g' },
      { name: 'Noise cancellation', value: 'Adaptive active noise cancellation' },
    ],
    featured: true,
    bestSeller: true,
  },
  {
    name: 'Apple AirPods Pro 2',
    slug: 'apple-airpods-pro-2',
    brand: 'Apple',
    category: 'Earbuds',
    shortDescription:
      'True wireless earbuds with adaptive audio and active noise cancellation.',
    fullDescription:
      'AirPods Pro 2 deliver an immersive personal listening experience with active noise cancellation, transparency mode, spatial audio, and seamless integration across Apple devices.',
    price: 249,
    discountPrice: 229,
    stock: 38,
    rating: 4.7,
    images: [
      {
        url: 'https://target.scene7.com/is/image/Target/GUEST_8e20860c-a6bb-4351-8ce8-78cbbb0e6051',
        altText: 'Apple AirPods Pro 2 earbuds with charging case',
      },
    ],
    specifications: [
      { name: 'Chip', value: 'Apple H2' },
      { name: 'Battery life', value: 'Up to 6 hours per charge' },
      { name: 'Charging', value: 'USB-C, MagSafe, and Qi' },
      { name: 'Water resistance', value: 'IP54' },
    ],
    featured: true,
    bestSeller: true,
  },
  {
    name: 'JBL Flip 6',
    slug: 'jbl-flip-6',
    brand: 'JBL',
    category: 'Speakers',
    shortDescription:
      'Portable waterproof Bluetooth speaker with bold, room-filling sound.',
    fullDescription:
      'The JBL Flip 6 is a compact outdoor-ready speaker with a two-way driver system, durable waterproof construction, and enough battery life for a full day of portable listening.',
    price: 129.95,
    discountPrice: 109.95,
    stock: 42,
    rating: 4.6,
    images: [
      {
        url: 'https://cdn.shopware.store/N/R/R/AlrFq/media/68/53/cb/1781611710/3d5d13f5ad25403dab3ba8588bfb031c.png',
        altText: 'JBL Flip 6 portable Bluetooth speaker',
      },
    ],
    specifications: [
      { name: 'Output power', value: '30 W total' },
      { name: 'Battery life', value: 'Up to 12 hours' },
      { name: 'Protection', value: 'IP67 waterproof and dustproof' },
      { name: 'Connectivity', value: 'Bluetooth 5.1' },
    ],
    featured: false,
    bestSeller: true,
  },
  {
    name: 'Bose QuietComfort Ultra',
    slug: 'bose-quietcomfort-ultra',
    brand: 'Bose',
    category: 'Headphones',
    shortDescription:
      'Luxury noise-cancelling headphones with immersive spatialized sound.',
    fullDescription:
      'Bose QuietComfort Ultra headphones pair refined comfort with powerful noise cancellation and immersive audio processing for premium everyday and travel listening.',
    price: 429,
    discountPrice: null,
    stock: 16,
    rating: 4.7,
    images: [
      {
        url: 'https://lcdn.mediagalaxy.ro/media/catalog/product/c/a/casti_bose_quietcomfort_ultra_headphones_black_update_5_a14506bf.jpg',
        altText: 'Bose QuietComfort Ultra headphones',
      },
    ],
    specifications: [
      { name: 'Connectivity', value: 'Bluetooth 5.3, 2.5 mm to 3.5 mm' },
      { name: 'Battery life', value: 'Up to 24 hours' },
      { name: 'Audio modes', value: 'Quiet, Aware, and Immersion' },
      { name: 'Charging', value: 'USB-C' },
    ],
    featured: true,
    bestSeller: false,
  },
  {
    name: 'Audio-Technica AT2020',
    slug: 'audio-technica-at2020',
    brand: 'Audio-Technica',
    category: 'Microphones',
    shortDescription:
      'Cardioid condenser microphone designed for clear home-studio recording.',
    fullDescription:
      'The Audio-Technica AT2020 is a reliable side-address condenser microphone with a focused cardioid pickup pattern, well suited to vocals, acoustic instruments, podcasting, and project studios.',
    price: 99,
    discountPrice: null,
    stock: 30,
    rating: 4.7,
    images: [
      {
        url: 'https://www.audicoonline.co.za/image/cache/catalog/Products/Audio-Technica/AT2020/AT2020-1-1000x1000.jpg',
        altText: 'Audio-Technica AT2020 studio condenser microphone',
      },
    ],
    specifications: [
      { name: 'Microphone type', value: 'Condenser' },
      { name: 'Polar pattern', value: 'Cardioid' },
      { name: 'Frequency response', value: '20 Hz–20 kHz' },
      { name: 'Connection', value: '3-pin XLR' },
    ],
    featured: false,
    bestSeller: true,
  },
  {
    name: 'Sony HT-A5000',
    slug: 'sony-ht-a5000',
    brand: 'Sony',
    category: 'Soundbars',
    shortDescription:
      'Premium 5.1.2-channel Dolby Atmos soundbar for cinematic home audio.',
    fullDescription:
      'The Sony HT-A5000 brings spacious cinema sound to the living room with upward-firing speakers, Dolby Atmos, DTS:X, room calibration, and support for high-resolution video passthrough.',
    price: 999.99,
    discountPrice: 899.99,
    stock: 9,
    rating: 4.5,
    images: [
      {
        url: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1682585717/Croma%20Assets/Entertainment/Speakers%20and%20Media%20Players/Images/266383_0_mffmsx.png',
        altText: 'Sony HT-A5000 home theatre soundbar',
      },
    ],
    specifications: [
      { name: 'Channels', value: '5.1.2' },
      { name: 'Surround formats', value: 'Dolby Atmos and DTS:X' },
      { name: 'Video support', value: '8K HDR and 4K/120 passthrough' },
      { name: 'Connectivity', value: 'HDMI eARC, Wi-Fi, Bluetooth' },
    ],
    featured: true,
    bestSeller: false,
  },
  {
    name: 'FiiO K7 DAC',
    slug: 'fiio-k7-dac',
    brand: 'FiiO',
    category: 'DACs',
    shortDescription:
      'Desktop balanced DAC and headphone amplifier for high-resolution audio.',
    fullDescription:
      'The FiiO K7 is a compact desktop digital-to-analogue converter and headphone amplifier featuring balanced circuitry, multiple inputs, and enough output power for demanding headphones.',
    price: 199.99,
    discountPrice: 179.99,
    stock: 21,
    rating: 4.6,
    images: [
      {
        url: 'https://fitgearshop.vn/img/558x570/resize/upload/product/2022/07/05/fiio-k7-62c3a3d908e57-05072022170721.jpg',
        altText: 'FiiO K7 desktop DAC and headphone amplifier',
      },
    ],
    specifications: [
      { name: 'DAC', value: 'Dual AK4493SEQ' },
      { name: 'Headphone outputs', value: '6.35 mm and 4.4 mm balanced' },
      { name: 'Digital inputs', value: 'USB, optical, and coaxial' },
      { name: 'Maximum resolution', value: '32-bit/384 kHz PCM, DSD256' },
    ],
    featured: true,
    bestSeller: false,
  },
  {
    name: 'Marshall Acton III',
    slug: 'marshall-acton-iii',
    brand: 'Marshall',
    category: 'Speakers',
    shortDescription:
      'Compact home Bluetooth speaker with classic Marshall styling.',
    fullDescription:
      'Marshall Acton III combines iconic amplifier-inspired design with wide stereo sound, tactile bass and treble controls, and straightforward Bluetooth connectivity for smaller living spaces.',
    price: 279.99,
    discountPrice: 249.99,
    stock: 18,
    rating: 4.5,
    images: [
      {
        url: 'https://doc.brloh.sk/pic/COWZF00101-600-600.webp',
        altText: 'Marshall Acton III Bluetooth home speaker',
      },
    ],
    specifications: [
      { name: 'Amplification', value: '60 W total' },
      { name: 'Frequency range', value: '45 Hz–20 kHz' },
      { name: 'Connectivity', value: 'Bluetooth 5.2 and 3.5 mm input' },
      { name: 'Controls', value: 'Analogue bass and treble controls' },
    ],
    featured: false,
    bestSeller: false,
  },
];

export default products;
