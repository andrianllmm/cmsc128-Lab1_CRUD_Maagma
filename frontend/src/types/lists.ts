export const LIST_NAME_MAX_LENGTH = 50;

// The owner or a member of a list
export interface ListUser {
  _id: string;
  email: string;
  displayName: string;
}

export interface List {
  _id: string;
  name: string;
  owner: ListUser;
  members: ListUser[];
  personal: boolean;
  createdAt: string;
  updatedAt: string;
}
