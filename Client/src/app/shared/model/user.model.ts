

export interface BaseUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  subscription?: Subscription;
  imageUrl?: string;
}

export enum Subscription {
  PREMIUM, FREE
}

export interface ConnectedUser extends BaseUser {
  authorities?: string[];
}
