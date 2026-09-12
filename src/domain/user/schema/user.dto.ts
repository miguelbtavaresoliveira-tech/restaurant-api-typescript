export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'WAITER';
  createdAt: Date;
  updatedAt: Date;
}
