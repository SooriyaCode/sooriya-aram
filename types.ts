export enum UserType {
  GUEST = 'GUEST',
  UNREGISTERED = 'UNREGISTERED', // Type 1
  REGISTERED = 'REGISTERED',     // Type 2
  ASSISTANT = 'ASSISTANT'        // Type 3
}

export interface User {
  id: string;
  name: string;
  type: UserType;
  subCategory?: string;
  avatar?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  image: string;
}

export interface Workshop {
  id: string;
  title: string;
  instructor: string;
  date: string;
  fee: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  company: string;
  price: string;
  image: string;
}

// Chat interfaces
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
