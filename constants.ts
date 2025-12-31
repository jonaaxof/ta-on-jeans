
import { FitCategory, Product, WashCategory } from './types';

// Updated stable Unsplash images for Female Denim
const IMAGES = {
  // Shorts & Skirts
  shortGode: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800",
  shortDestroyed: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
  skirt: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800",

  // Pants Fits
  wideLeg: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800", // Using Mom Jeans as fallback
  momJeans: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800", // Classic Blue
  skinny: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800", // Using Mom Jeans as fallback

  // Outerwear
  jacket: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800", // Using Mom Jeans as fallback for stability

  // Textures/Details (Back images)
  backDetail: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&q=80&w=800",
  textureLight: "https://images.unsplash.com/photo-1605518216938-7f31b7b64711?auto=format&fit=crop&q=80&w=800", // Light Wash Texture
  textureDark: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&q=80&w=800", // Dark Texture
  blackDenim: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800", // Black
  distressed: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800", // Ripped

  // Specific User Provided Images
  washClara: "https://grifedobras.cdn.magazord.com.br/img/2022/11/produto/1270/shorts-jeans-claro-com-cinto-branco.jpg?ims=475x650",
  shortPedraria: "https://a-static.mlcdn.com.br/800x800/short-miller-original-jeans-feminino-deluxe-preco-baixo-aqui/crisconf/11285019896/4bea617412606ad7a9650ef67ff2cfab.jpeg",
  kitImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    reference: 'SHT-023',
    title: 'Short Godê Barra Fio',
    price: 69.90,
    fit: 'Shorts',
    wash: 'Clara',
    imageFront: IMAGES.shortGode,
    imageBack: IMAGES.backDetail,
    isNew: true,
    description: 'O queridinho do momento! Short modelo Godê que não marca e dá efeito de cintura fina. Barra desfiada (fio) e lavagem clara marmorizada.',
    material: '100% Algodão (Sem Elastano)',
    grade: '34 ao 42 (Grade com 10 peças)',
    gender: 'feminino',
    category: 'shorts'
  },
  {
    id: '2',
    reference: 'CLC-105',
    title: 'Wide Leg Destroyed',
    price: 98.90,
    fit: 'Wide Leg',
    wash: 'Média',
    imageFront: IMAGES.wideLeg,
    imageBack: IMAGES.textureLight,
    isNew: true,
    description: 'Calça Wide Leg super estilosa com rasgo no joelho. Cintura super alta que valoriza o corpo. Tecido premium com caimento impecável.',
    material: '100% Algodão Premium',
    grade: '36 ao 44 (Grade com 12 peças)',
    gender: 'feminino',
    category: 'calca'
  },
  {
    id: '3',
    reference: 'SAI-088',
    title: 'Saia Midi Fenda Frontal',
    price: 89.90,
    fit: 'Saia',
    wash: 'Escura',
    imageFront: IMAGES.skirt,
    imageBack: IMAGES.textureDark,
    description: 'Elegância e modernidade. Saia midi jeans com fenda frontal e barra feita. Lavagem escura amaciada.',
    material: '98% Algodão, 2% Elastano',
    grade: '36 ao 44 (Grade com 8 peças)',
    gender: 'feminino',
    category: 'saia'
  },
  {
    id: '4',
    reference: 'SHT-045',
    title: 'Short Mom Cintura Alta',
    price: 65.00,
    fit: 'Shorts',
    wash: 'Média',
    imageFront: IMAGES.shortDestroyed,
    imageBack: IMAGES.backDetail,
    description: 'Clássico vintage. Short Mom mais soltinho na perna e cintura bem alta. Barra dobrada costurada.',
    material: '100% Algodão',
    grade: '36 ao 46 (Grade com 12 peças)',
    gender: 'feminino',
    category: 'shorts'
  },
  {
    id: '5',
    reference: 'CLC-099',
    title: 'Skinny Lipo Power',
    price: 85.90,
    fit: 'Skinny',
    wash: 'Escura',
    imageFront: IMAGES.skinny,
    imageBack: IMAGES.textureDark,
    description: 'Tecnologia Chapa Barriga. Jeans com muito elastano (Power) que modela sem apertar. Cinta interna compressora.',
    material: '97% Algodão, 3% Elastano',
    grade: '34 ao 46 (Grade com 12 peças)',
    gender: 'feminino',
    category: 'calca'
  },
  {
    id: '6',
    reference: 'CLC-201',
    title: 'Mom Jeans 90s',
    price: 92.90,
    fit: 'Mom',
    wash: 'Clara',
    imageFront: IMAGES.momJeans,
    imageBack: IMAGES.textureLight,
    description: 'Jeans rígido com lavagem stone wash bem anos 90. Modelagem Mom original: cintura alta e perna afunilada.',
    material: '100% Algodão',
    grade: '36 ao 44 (Grade com 10 peças)',
    gender: 'feminino',
    category: 'calca'
  },
  {
    id: '7',
    reference: 'JAQ-012',
    title: 'Jaqueta Oversized',
    price: 119.90,
    fit: 'Jaqueta',
    wash: 'Distressed',
    imageFront: IMAGES.jacket,
    imageBack: IMAGES.textureLight,
    description: 'A terceira peça essencial. Jaqueta com modelagem ampla (oversized), puídos leves e botões em metal envelhecido.',
    material: '100% Algodão',
    grade: 'P, M, G, GG (Grade com 8 peças)',
    gender: 'feminino',
    category: 'jaqueta'
  },
  {
    id: '8',
    reference: 'SHT-050',
    title: 'Short Pedraria Deluxe',
    price: 79.90,
    fit: 'Shorts',
    wash: 'Preta',
    imageFront: IMAGES.shortPedraria,
    imageBack: IMAGES.backDetail,
    description: 'Para balada ou festas. Short preto com aplicações de strass no bolso lateral. Barra desfiada.',
    material: '98% Algodão, 2% Elastano',
    grade: '36 ao 44 (Grade com 10 peças)',
    gender: 'feminino',
    category: 'shorts'
  },
  {
    id: '10',
    reference: 'OUT-001',
    title: 'Calça Flare (Últimas Peças)',
    price: 49.90,
    fit: 'Wide Leg',
    wash: 'Escura',
    imageFront: IMAGES.blackDenim,
    imageBack: IMAGES.textureDark,
    isOutlet: true,
    description: 'Calça Flare Clássica com preço de liquidação. Perfeita para compor looks de trabalho.',
    material: '98% Algodão 2% Elastano',
    grade: 'Apenas 36 e 38',
    gender: 'feminino',
    category: 'calca'
  },
  {
    id: '11',
    reference: 'OUT-002',
    title: 'Shorts Color (Promoção)',
    price: 39.90,
    fit: 'Shorts',
    wash: 'Color',
    imageFront: IMAGES.shortGode,
    imageBack: IMAGES.backDetail,
    isOutlet: true,
    description: 'Shorts em sarja colorida. Ponta de estoque.',
    material: '100% Algodão',
    grade: 'Grades Quebradas',
    gender: 'feminino',
    category: 'shorts'
  },
  // MASCULINO ITEMS
  {
    id: '12',
    reference: 'M-CLC-001',
    title: 'Calça Slim Masculina',
    price: 89.90,
    fit: 'Masculino',
    wash: 'Média',
    imageFront: IMAGES.momJeans, // reusing image for mock
    imageBack: IMAGES.textureDark,
    description: 'Calça jeans masculina corte slim, moderna e confortável.',
    material: '98% Algodão, 2% Elastano',
    grade: '38 ao 48',
    gender: 'masculino',
    category: 'calca'
  },
  {
    id: '13',
    reference: 'M-BER-001',
    title: 'Bermuda Jeans Destroyed',
    price: 69.90,
    fit: 'Masculino',
    wash: 'Clara',
    imageFront: IMAGES.shortDestroyed, // reusing image for mock
    imageBack: IMAGES.textureLight,
    description: 'Bermuda masculina com rasgos discretos.',
    material: '100% Algodão',
    grade: '38 ao 48',
    gender: 'masculino',
    category: 'bermuda'
  },
  {
    id: '14',
    reference: 'M-CAM-001',
    title: 'Camiseta Básica Preta',
    price: 49.90,
    fit: 'Masculino',
    wash: 'Preta',
    imageFront: IMAGES.blackDenim, // placeholder
    imageBack: IMAGES.textureDark,
    description: 'Camiseta básica algodão premium.',
    material: '100% Algodão',
    grade: 'P, M, G, GG',
    gender: 'masculino',
    category: 'camiseta'
  }
];

export const FITS: FitCategory[] = [
  { id: 'Shorts', title: 'Shorts', image: IMAGES.shortGode, description: 'Godê, Mom e Destroyed.' },
  { id: 'Wide Leg', title: 'Wide Leg', image: IMAGES.wideLeg, description: 'A queridinha do momento.' },
  { id: 'Skinny', title: 'Skinny', image: IMAGES.skinny, description: 'Modeladora com elastano.' },
  { id: 'Mom', title: 'Mom Jeans', image: IMAGES.momJeans, description: 'Cintura alta e conforto.' },
  { id: 'Saia', title: 'Saias', image: IMAGES.skirt, description: 'Minis e Midis tendências.' },
  { id: 'Jaqueta', title: 'Jaquetas', image: IMAGES.jacket, description: 'Terceira peça estilosa.' },
  { id: 'Kit', title: 'Kits Revenda', image: IMAGES.kitImage, description: 'Melhor custo-benefício.' },
];

export const WASHES: WashCategory[] = [
  { id: 'light', title: 'Lavagem Clara', image: IMAGES.washClara }, // Uses specific image provided
  { id: 'indigo', title: 'Azul Médio', image: IMAGES.momJeans },
  { id: 'black', title: 'Jeans Escuro', image: IMAGES.blackDenim },
  { id: 'distressed', title: 'Destroyed', image: IMAGES.distressed },
];
