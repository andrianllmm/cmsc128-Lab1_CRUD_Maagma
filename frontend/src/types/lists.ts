export interface List {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  personal: boolean;
  createdAt: string;
  updatedAt: string;
}
