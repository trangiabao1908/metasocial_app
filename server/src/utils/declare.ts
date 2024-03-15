interface User {
  userId: string;
}
declare namespace Express {
  interface Request {
    user: User;
  }
}
