// 사용자
export interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN"; // 추후 확장 고려
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

// 비품
export interface Equipment {
  id: number;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  createdAt: string;
}

export interface EquipmentListResponse {
  content: Equipment[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 장바구니
export interface CartItem {
  equipmentId: number;
  equipmentName: string;
  imageUrl: string;
  quantity: number;
}

// 신청
export interface EquipmentRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason?: string;
  createdAt: string;
  processedAt?: string;
  items: RequestItem[];
}

export interface RequestItem {
  equipmentId: number;
  equipmentName: string;
  equipmentImageUrl?: string;
  quantity: number;
}

// 페이징
export interface PageRequest {
  page?: number;
  size?: number;
  keyword?: string;
  category?: string;
}
