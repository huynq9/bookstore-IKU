  export interface AuthResponse {
    message: string;
    accessToken: string;
    user: {
      _id: string;
      username: string;
      email: string;
      role: string;
    };
  
  }

  export interface ILoginRequest{
    email: string,
    password: string,
    remember:boolean

  }
  export interface IRegisterRequest{
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  }
  export interface IUser{
    _id?: string,
    username: string,
    email: string,
    voucherwallet: string[],
    role: string
  }