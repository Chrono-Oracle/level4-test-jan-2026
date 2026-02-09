export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  category: 'Admin' | 'Teacher' | 'Student';
  createdAt?: string;
  updatedAt?: string;
};

export type Contact = {
  _id: string;
  fullname: string;
  phone: number;
  email: string;
  addedBy: string;
  createdAt?: string;
  updatedAt?: string;
};
