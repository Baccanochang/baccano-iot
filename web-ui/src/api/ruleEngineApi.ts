import apiClient from './axiosConfig';

// 规则类型定义
export interface RuleAction {
  id?: string;
  actionType: string;
  actionContent: string;
  actionParams?: Record<string, any>;
}

export interface RuleCondition {
  id?: string;
  conditionType: string;
  conditionContent: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  type: string;
  status: number; // 0-禁用，1-启用
  triggerCondition: string;
  priority: number;
  expression: string;
  actions: RuleAction[];
  conditions: RuleCondition[];
  triggerCount: number;
  lastTriggered?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 规则引擎API服务
export const ruleEngineApi = {
  // 获取规则列表
  getRules: async (): Promise<Rule[]> => {
    return apiClient.get('/rules');
  },

  // 获取规则详情
  getRuleById: async (id: string): Promise<Rule> => {
    return apiClient.get(`/rules/${id}`);
  },

  // 创建规则
  createRule: async (rule: Omit<Rule, 'id' | 'triggerCount' | 'lastTriggered' | 'createdAt' | 'updatedAt'>): Promise<Rule> => {
    return apiClient.post('/rules', rule);
  },

  // 更新规则
  updateRule: async (id: string, rule: Partial<Rule>): Promise<Rule> => {
    return apiClient.put(`/rules/${id}`, rule);
  },

  // 删除规则
  deleteRule: async (id: string): Promise<void> => {
    return apiClient.delete(`/rules/${id}`);
  },

  // 切换规则状态
  toggleRuleStatus: async (id: string, status: number): Promise<Rule> => {
    return apiClient.patch(`/rules/${id}/status`, { status });
  },

  // 执行规则
  executeRule: async (id: string, data?: Record<string, any>): Promise<any> => {
    return apiClient.post(`/rules/${id}/execute`, data);
  },

  // 获取规则执行历史
  getRuleExecutionHistory: async (id: string): Promise<any[]> => {
    return apiClient.get(`/rules/${id}/history`);
  },

  // 批量执行规则
  executeRules: async (data: Record<string, any>): Promise<any> => {
    return apiClient.post('/rules/execute', data);
  },
};
