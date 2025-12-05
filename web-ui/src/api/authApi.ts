import apiClient from './axiosConfig';

// 登录请求类型
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

// 用户信息类型
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

// 认证API服务
export const authApi = {
  // 登录
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/auth/login', credentials);
  },

  // 登出
  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  // 刷新令牌
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<UserInfo> => {
    return apiClient.get('/auth/me');
  },

  // 检查权限
  checkPermission: (permission: string): boolean => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.permissions?.includes(permission) || false;
  },

  // 检查角色
  checkRole: (role: string): boolean => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === role;
  },
};

// JWT令牌管理
export const tokenManager = {
  // 保存令牌
  saveToken: (token: string, refreshToken?: string, rememberMe?: boolean) => {
    if (rememberMe) {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    } else {
      sessionStorage.setItem('token', token);
      if (refreshToken) {
        sessionStorage.setItem('refreshToken', refreshToken);
      }
    }
  },

  // 获取令牌
  getToken: (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },

  // 获取刷新令牌
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  },

  // 清除令牌
  clearTokens: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // 保存用户信息
  saveUser: (user: UserInfo) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // 获取用户信息
  getUser: (): UserInfo | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
