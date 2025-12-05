import { useState, useEffect } from 'react';
import { Activity, Cpu, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { deviceApi } from '../api/deviceApi';
import { ruleEngineApi } from '../api/ruleEngineApi';

// 设备状态数据类型
interface DeviceStatusData {
  time: string;
  active: number;
  inactive: number;
}

// 数据流量数据类型
interface DataTrafficData {
  time: string;
  mb: number;
}

// 仪表盘统计数据类型
interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  activeRules: number;
  alerts: number;
  deviceOnlineRate: number;
  newDevices: number;
  newRules: number;
  alertsTrend: number;
}

// 活动日志类型
interface ActivityLog {
  device: string;
  event: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

// 模拟数据
const mockDeviceData: DeviceStatusData[] = [
  { time: '00:00', active: 45, inactive: 5 },
  { time: '04:00', active: 42, inactive: 8 },
  { time: '08:00', active: 48, inactive: 2 },
  { time: '12:00', active: 47, inactive: 3 },
  { time: '16:00', active: 49, inactive: 1 },
  { time: '20:00', active: 46, inactive: 4 },
];

const mockDataTrafficData: DataTrafficData[] = [
  { time: '00:00', mb: 120 },
  { time: '04:00', mb: 95 },
  { time: '08:00', mb: 180 },
  { time: '12:00', mb: 210 },
  { time: '16:00', mb: 195 },
  { time: '20:00', mb: 165 },
];

const mockActivityLogs: ActivityLog[] = [
  { device: 'Temperature Sensor #12', event: 'Data received', time: '2 min ago', status: 'success' },
  { device: 'Motion Detector #05', event: 'Alert triggered', time: '15 min ago', status: 'warning' },
  { device: 'Smart Valve #08', event: 'Rule executed', time: '32 min ago', status: 'info' },
  { device: 'Humidity Sensor #21', event: 'Connection restored', time: '1 hour ago', status: 'success' },
  { device: 'Power Monitor #03', event: 'Threshold exceeded', time: '2 hours ago', status: 'warning' },
];

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 50,
    activeDevices: 46,
    activeRules: 18,
    alerts: 4,
    deviceOnlineRate: 92,
    newDevices: 5,
    newRules: 3,
    alertsTrend: -12.5
  });
  const [deviceStatusData, setDeviceStatusData] = useState<DeviceStatusData[]>(mockDeviceData);
  const [dataTrafficData, setDataTrafficData] = useState<DataTrafficData[]>(mockDataTrafficData);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [loading, setLoading] = useState(false);

  // 获取仪表盘统计数据
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // 这里应该调用实际的API获取数据
      // 暂时使用模拟数据
      const devices = await deviceApi.getDevices().catch(() => []);
      const rules = await ruleEngineApi.getRules().catch(() => []);
      
      // 计算统计数据
      const totalDevices = devices.length || 50;
      const activeDevices = devices.filter(d => d.status === 1).length || 46;
      const activeRules = rules.filter(r => r.status === 1).length || 18;
      
      setStats(prev => ({
        ...prev,
        totalDevices,
        activeDevices,
        activeRules,
        deviceOnlineRate: totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 92
      }));
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchDashboardStats();
    
    // 定时刷新数据（每30秒）
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // 刷新数据
  const refreshData = () => {
    fetchDashboardStats();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">System overview and analytics</p>
        </div>
        <button 
          onClick={refreshData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Devices</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDevices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">{stats.newDevices} new</span>
            <span className="text-gray-500">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Devices</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeDevices}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            <span className="text-green-600 font-medium">{stats.deviceOnlineRate}% online</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeRules}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">{stats.newRules} new</span>
            <span className="text-gray-500">this week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.alerts}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm">
            {stats.alertsTrend < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-green-600">{Math.abs(stats.alertsTrend)}% decrease</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-red-600">{stats.alertsTrend}% increase</span>
              </>
            )}
            <span className="text-gray-500">vs last week</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Status (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={deviceStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                formatter={(value: any) => [`${value} devices`, '']}
              />
              <Legend />
              <Area type="monotone" dataKey="active" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Active" />
              <Area type="monotone" dataKey="inactive" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Inactive" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Traffic (MB)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                formatter={(value: any) => [`${value} MB`, 'Traffic']}
              />
              <Line 
                type="monotone" 
                dataKey="mb" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#3b82f6' }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { type: 'Temperature', count: 15 },
              { type: 'Humidity', count: 12 },
              { type: 'Power', count: 8 },
              { type: 'Motion', count: 10 },
              { type: 'Actuator', count: 5 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="type" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                formatter={(value: any) => [`${value} devices`, 'Count']}
              />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Devices" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {activityLogs.map((activity, index) => (
            <div key={index} className="p-5 hover:bg-gray-50 transition-colors flex items-start gap-4">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{activity.device}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100 text-green-700' :
                    activity.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.event}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
