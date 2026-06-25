export interface AuthInterface {
  id: string
  role: 'user' | 'admin'
}

export interface LoginResponse {
  id: string
  role: 'user' | 'admin'
}

export interface UserAddress {
  street: string
  number: string
  floor?: string
  apartment?: string
  city: string
  province: string
}

export interface UserLoginCredentials {
  email: string
  password: string
}

export interface UserRegisterCredentials {
  firstName: string
  lastName: string
  dni: string
  phone: string
  email: string
  password: string
  address: UserAddress
}

export interface AdminLoginCredentials {
  username: string
  password: string
}

export interface AdminRegisterCredentials {
  username: string
  password: string
}

export interface UserDashboardResponse {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dni: string
  address: UserAddress
  createdAt: string
}

export interface AdminDashboardResponse {
  _id: string
  username: string
}

export interface AuthLoadingState {
  me: boolean
  loginUser: boolean
  loginAdmin: boolean
  logout: boolean
  registerUser: boolean
  confirmUser: boolean
}