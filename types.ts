
export type FitType = 'Todos' | 'Skinny' | 'Mom' | 'Wide Leg' | 'Shorts' | 'Saia' | 'Jaqueta' | 'Reto' | 'Kit' | 'Masculino';

export type UserRole = 'customer' | 'moderator' | 'admin' | 'owner';

export interface Product {
  id: string;
  reference: string; // Wholesale needs reference codes
  title: string;
  price: number;
  fit: FitType;
  wash: 'Clara' | 'Média' | 'Escura' | 'Preta' | 'Distressed' | 'Color';
  imageFront: string;
  imageBack: string;
  isNew?: boolean;
  isOutlet?: boolean; // New property for Outlet items
  description: string;
  material: string;
  grade: string; // e.g. "36 ao 44"
  gender?: 'feminino' | 'masculino';
  category?: 'calca' | 'shorts' | 'saia' | 'jaqueta' | 'camiseta' | 'bermuda' | 'vestido';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserData {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: UserRole; // Optional user role used in UserData context
}

export interface WashCategory {
  id: string;
  title: string;
  image: string;
}

export interface FitCategory {
  id: FitType;
  title: string;
  image: string;
  description: string;
}
