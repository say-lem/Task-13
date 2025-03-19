export interface IUser {
    id?: string;
    username: string;
    email: string;
    password: string;
  }
  
  export interface IAuthPayload {
    userId: string;
    username: string;
    email: string;
  }
  