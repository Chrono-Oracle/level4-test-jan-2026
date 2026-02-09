export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Contact = {
  _id: string;
  fullname: string;
  phone: number;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};
