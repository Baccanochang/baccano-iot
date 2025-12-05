import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Trash2, Edit, AlertCircle, RotateCw } from 'lucide-react';
import { Rule, RuleAction, RuleCondition, ruleEngineApi } from '../api/ruleEngineApi';

const mockRules: Rule[] = [
  {
    id: 'RULE001',
    name: 'High Temperature Alert',
    description: 'Send alert when temperature exceeds 30°C',
    type: 'threshold',
    status: 1,
    triggerCondition: 'data.temperature > 30',
    priority: 1,
    expression: 'data.temperature > 30',
    actions: [
      {
        actionType: 'notification',
        actionContent: '温度超过30度',
        actionParams: { type: 'email', recipient: 'admin@example.com' }
      }
    ],
    conditions: [
      {
        conditionType: 'temperature',
        conditionContent: 'temperature',
        operator: '>',
        value: '30'
      }
    ],
    triggerCount: 45,
    lastTriggered: '2 hours ago',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'RULE002',
    name: 'Low Humidity Warning',
    description: 'Alert when humidity drops below 40%',
    type: 'threshold',
    status: 1,
    triggerCondition: 'data.humidity < 40',
    priority: 2,
    expression: 'data.humidity < 40',
    actions: [
      {
        actionType: 'notification',
        actionContent: '湿度低于40%',
        actionParams: { type: 'email', recipient: 'admin@example.com' }
      }
    ],
    conditions: [
      {
        conditionType: 'humidity',
        conditionContent: 'humidity',
        operator: '<',
        value: '40'
      }
    ],
    triggerCount: 12,
    lastTriggered: '1 day ago',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'RULE003',
    name: 'Motion Detection',
    description: 'Turn on lights when motion detected',
    type: 'event',
    status: 1,
    triggerCondition: 'data.motion = "detected"',
    priority: 3,
    expression: 'data.motion = "detected"',
    actions: [
      {
        actionType: 'device_control',
        actionContent: 'turn_on_light',
        actionParams: { deviceId: 'DEVICE001', command: 'on' }
      }
    ],
    conditions: [
      {
        conditionType: 'motion',
        conditionContent: 'motion',
        operator: '=',
        value: 'detected'
      }
    ],
    triggerCount: 234,
    lastTriggered: '15 min ago',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'RULE004',
    name: 'Power Optimization',
    description: 'Turn off devices during off-peak hours',
    type: 'schedule',
    status: 0,
    triggerCondition: 'time >= 22:00 AND time <= 06:00',
    priority: 4,
    expression: 'time >= 22:00 AND time <= 06:00',
    actions: [
      {
        actionType: 'device_control',
        actionContent: 'turn_off_devices',
        actionParams: { groupId: 'GROUP001', command: 'off' }
      }
    ],
    conditions: [
      {
        conditionType: 'time',
        conditionContent: 'time',
        operator: '>=',
        value: '22:00'
      },
      {
        conditionType: 'time',
        conditionContent: 'time',
        operator: '<=',
        value: '06:00'
      }
    ],
    triggerCount: 87,
    lastTriggered: '3 days ago',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'RULE005',
    name: 'Device Offline Alert',
    description: 'Alert when device goes offline',
    type: 'status',
    status: 1,
    triggerCondition: 'device.status = "offline"',
    priority: 5,
    expression: 'device.status = "offline"',
    actions: [
      {
        actionType: 'notification',
        actionContent: '设备离线',
        actionParams: { type: 'sms', recipient: '+1234567890' }
      }
    ],
    conditions: [
      {
        conditionType: 'device_status',
        conditionContent: 'device.status',
        operator: '=',
        value: 'offline'
      }
    ],
    triggerCount: 8,
    lastTriggered: '6 hours ago',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
];

// 规则执行历史类型
interface RuleExecutionHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  triggerTime: string;
  triggerData: Record<string, any>;
  result: string;
  status: 'success' | 'failure';
  executionTime: number; // 毫秒
}

export function RuleEngine() {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [ruleHistory, setRuleHistory] = useState<RuleExecutionHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 模拟规则执行历史数据
  const mockRuleHistory: RuleExecutionHistory[] = [
    {
      id: 'HIST001',
      ruleId: 'RULE001',
      ruleName: 'High Temperature Alert',
      triggerTime: '2024-01-15T14:30:00Z',
      triggerData: { temperature: 32.5, humidity: 58 },
      result: 'Alert sent successfully',
      status: 'success',
      executionTime: 125
    },
    {
      id: 'HIST002',
      ruleId: 'RULE003',
      ruleName: 'Motion Detection',
      triggerTime: '2024-01-15T14:25:00Z',
      triggerData: { motion: 'detected', area: 'living room' },
      result: 'Light turned on',
      status: 'success',
      executionTime: 98
    },
    {
      id: 'HIST003',
      ruleId: 'RULE002',
      ruleName: 'Low Humidity Warning',
      triggerTime: '2024-01-15T14:20:00Z',
      triggerData: { humidity: 38, temperature: 22.8 },
      result: 'Email notification sent',
      status: 'success',
      executionTime: 156
    },
    {
      id: 'HIST004',
      ruleId: 'RULE001',
      ruleName: 'High Temperature Alert',
      triggerTime: '2024-01-15T14:15:00Z',
      triggerData: { temperature: 31.2, humidity: 60 },
      result: 'Alert sent successfully',
      status: 'success',
      executionTime: 112
    },
    {
      id: 'HIST005',
      ruleId: 'RULE003',
      ruleName: 'Motion Detection',
      triggerTime: '2024-01-15T14:10:00Z',
      triggerData: { motion: 'detected', area: 'kitchen' },
      result: 'Light turned on',
      status: 'success',
      executionTime: 89
    }
  ];

  // 获取规则执行历史
  const fetchRuleHistory = async (ruleId: string) => {
    setHistoryLoading(true);
    try {
      const data = await ruleEngineApi.getRuleExecutionHistory(ruleId);
      setRuleHistory(data);
    } catch (error) {
      console.error(`Failed to fetch execution history for rule ${ruleId}:`, error);
      // 使用模拟数据作为 fallback
      setRuleHistory(mockRuleHistory.filter(item => item.ruleId === ruleId));
    } finally {
      setHistoryLoading(false);
    }
  };

  // 打开历史记录模态框
  const openHistoryModal = (rule: Rule) => {
    setSelectedRule(rule);
    fetchRuleHistory(rule.id);
    setShowHistoryModal(true);
  };

  // 关闭历史记录模态框
  const closeHistoryModal = () => {
    setSelectedRule(null);
    setShowHistoryModal(false);
  };

  // 获取规则列表
  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await ruleEngineApi.getRules();
      setRules(data);
    } catch (error) {
      console.error('Failed to fetch rules:', error);
      // 使用mock数据作为 fallback
      setRules(mockRules);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载规则列表
  useEffect(() => {
    fetchRules();
  }, []);

  // 切换规则状态
  const toggleRuleStatus = async (ruleId: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await ruleEngineApi.toggleRuleStatus(ruleId, newStatus);
      // 更新本地状态
      setRules(rules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, status: newStatus }
          : rule
      ));
    } catch (error) {
      console.error('Failed to toggle rule status:', error);
    }
  };

  // 删除规则
  const deleteRule = async (ruleId: string) => {
    try {
      await ruleEngineApi.deleteRule(ruleId);
      // 更新本地状态
      setRules(rules.filter(rule => rule.id !== ruleId));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  // 打开编辑模态框
  const openEditModal = (rule: Rule) => {
    setSelectedRule(rule);
    setShowEditModal(true);
  };

  // 关闭编辑模态框
  const closeEditModal = () => {
    setSelectedRule(null);
    setShowEditModal(false);
  };

  // 刷新规则列表
  const refreshRules = () => {
    fetchRules();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Rule Engine</h2>
          <p className="text-gray-600 mt-1">Create and manage automation rules</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshRules}
            disabled={loading}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            title="Refresh Rules"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Rule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Rules</p>
          <p className="text-gray-900 mt-1">{rules.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Active Rules</p>
          <p className="text-gray-900 mt-1">{rules.filter(r => r.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Triggers (24h)</p>
          <p className="text-gray-900 mt-1">{rules.reduce((acc, rule) => acc + rule.triggerCount, 0)}</p>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Rule Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Condition</th>
                <th className="px-6 py-3 text-left text-gray-700">Action</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Triggers</th>
                <th className="px-6 py-3 text-left text-gray-700">Last Triggered</th>
                <th className="px-6 py-3 text-right text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{rule.name}</p>
                      <p className="text-sm text-gray-500">{rule.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {rule.condition}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {rule.actions.map((action, index) => (
                        <span key={index} className="inline-block text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 mb-1">
                          {action.actionType}: {action.actionContent}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      rule.status === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        rule.status === 1 ? 'bg-green-600' : 'bg-gray-600'
                      }`}></div>
                      {rule.status === 1 ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{rule.triggerCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{rule.lastTriggered || 'Never'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleRuleStatus(rule.id, rule.status)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={rule.status === 1 ? 'Pause' : 'Play'}
                      >
                        {rule.status === 1 ? (
                          <Pause className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Play className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <button 
                        onClick={() => openEditModal(rule)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => openHistoryModal(rule)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View History"
                      >
                        <RotateCw className="w-4 h-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Create New Rule</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Rule Name</label>
                <input 
                  type="text" 
                  placeholder="Enter rule name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Description</label>
                <textarea 
                  placeholder="Enter rule description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Rule Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="threshold">Threshold</option>
                  <option value="event">Event</option>
                  <option value="schedule">Schedule</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-700">Conditions</label>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Add Condition</button>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-4 gap-2">
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="temperature">Temperature</option>
                          <option value="humidity">Humidity</option>
                          <option value="motion">Motion</option>
                          <option value="power">Power</option>
                          <option value="device_status">Device Status</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value=">">{'>'}</option>
                          <option value="<">{'<'}</option>
                          <option value="=">=</option>
                          <option value=">=">≥</option>
                          <option value="<=">≤</option>
                          <option value="!=">≠</option>
                        </select>
                      <input 
                        type="text" 
                        placeholder="Value"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-700">Actions</label>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Add Action</button>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="notification">Send Notification</option>
                          <option value="email">Send Email</option>
                          <option value="sms">Send SMS</option>
                          <option value="device_control">Device Control</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Action Content"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Parameters (JSON)</label>
                        <textarea 
                          placeholder='{"type": "email", "recipient": "admin@example.com"}'
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Priority</label>
                <input 
                  type="number" 
                  placeholder="1-100"
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Rules are evaluated in real-time as data is received from devices. Make sure your conditions are specific enough to avoid false triggers.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rule Modal */}
      {showEditModal && selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => closeEditModal()}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Edit Rule</h3>
              <button onClick={() => closeEditModal()} className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Rule Name</label>
                <input 
                  type="text" 
                  placeholder="Enter rule name"
                  defaultValue={selectedRule.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Description</label>
                <textarea 
                  placeholder="Enter rule description"
                  rows={3}
                  defaultValue={selectedRule.description}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Rule Type</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedRule.type}
                >
                  <option value="threshold">Threshold</option>
                  <option value="event">Event</option>
                  <option value="schedule">Schedule</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-700">Conditions</label>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Add Condition</button>
                </div>
                <div className="space-y-3">
                  {selectedRule.conditions.map((condition, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-4 gap-2">
                        <select 
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={condition.conditionType}
                        >
                          <option value="temperature">Temperature</option>
                          <option value="humidity">Humidity</option>
                          <option value="motion">Motion</option>
                          <option value="power">Power</option>
                          <option value="device_status">Device Status</option>
                        </select>
                        <select 
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={condition.operator}
                        >
                          <option value=">">{'>'}</option>
                          <option value="<">{'<'}</option>
                          <option value="=">=</option>
                          <option value=">=">≥</option>
                          <option value="<=">≤</option>
                          <option value="!=">≠</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Value"
                          defaultValue={condition.value}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-700">Actions</label>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Add Action</button>
                </div>
                <div className="space-y-3">
                  {selectedRule.actions.map((action, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <select 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue={action.actionType}
                          >
                            <option value="notification">Send Notification</option>
                            <option value="email">Send Email</option>
                            <option value="sms">Send SMS</option>
                            <option value="device_control">Device Control</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Action Content"
                            defaultValue={action.actionContent}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Parameters (JSON)</label>
                          <textarea 
                            placeholder='{"type": "email", "recipient": "admin@example.com"}'
                            rows={2}
                            defaultValue={JSON.stringify(action.actionParams || {}, null, 2)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Priority</label>
                <input 
                  type="number" 
                  placeholder="1-100"
                  min="1"
                  max="100"
                  defaultValue={selectedRule.priority}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value={1} selected={selectedRule.status === 1}>Active</option>
                  <option value={0} selected={selectedRule.status === 0}>Inactive</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Rules are evaluated in real-time as data is received from devices. Make sure your conditions are specific enough to avoid false triggers.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => closeEditModal()}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Update Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rule Execution History Modal */}
      {showHistoryModal && selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => closeHistoryModal()}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Rule Execution History - {selectedRule.name}</h3>
              <button onClick={() => closeHistoryModal()} className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {ruleHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No execution history available</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trigger Data
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Result
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Execution Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ruleHistory.map((history) => (
                          <tr key={history.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(history.triggerTime).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(history.triggerData, null, 2)}
                              </pre>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {history.result}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                history.status === 'success' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {history.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {history.executionTime} ms
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => closeHistoryModal()}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}