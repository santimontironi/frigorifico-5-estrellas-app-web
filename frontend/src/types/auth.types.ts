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

export interface LoginCredentials {
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
  email: string
}

export type ProfileResponse = UserDashboardResponse | AdminDashboardResponse

export interface AuthLoadingState {
  me: boolean
  login: boolean
  logout: boolean
  registerUser: boolean
  confirmUser: boolean
}