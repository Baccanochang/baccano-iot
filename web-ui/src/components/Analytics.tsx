import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Download } from 'lucide-react';

const deviceTypeData = [
  { name: 'Temperature', value: 18, color: '#3b82f6' },
  { name: 'Humidity', value: 12, color: '#10b981' },
  { name: 'Power', value: 8, color: '#f59e0b' },
  { name: 'Motion', value: 7, color: '#8b5cf6' },
  { name: 'Actuator', value: 5, color: '#ec4899' },
];

const weeklyData = [
  { day: 'Mon', messages: 12400, alerts: 45 },
  { day: 'Tue', messages: 13800, alerts: 52 },
  { day: 'Wed', messages: 11200, alerts: 38 },
  { day: 'Thu', messages: 14500, alerts: 61 },
  { day: 'Fri', messages: 13100, alerts: 48 },
  { day: 'Sat', messages: 9800, alerts: 32 },
  { day: 'Sun', messages: 8600, alerts: 28 },
];

const hourlyTraffic = [
  { hour: '00', traffic: 45 },
  { hour: '04', traffic: 32 },
  { hour: '08', traffic: 78 },
  { hour: '12', traffic: 95 },
  { hour: '16', traffic: 88 },
  { hour: '20', traffic: 67 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">Monitor performance and insights</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Avg Response Time</p>
          <p className="text-gray-900 mt-1">142ms</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>12% faster</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Messages (24h)</p>
          <p className="text-gray-900 mt-1">45,280</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>8% increase</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Data Processed</p>
          <p className="text-gray-900 mt-1">8.4 GB</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>15% increase</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Uptime</p>
          <p className="text-gray-900 mt-1">99.98%</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <span>Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Weekly Messages & Alerts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" fill="#3b82f6" />
              <Bar dataKey="alerts" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">Network Traffic (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyTraffic}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="traffic" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ r: 5, fill: '#8b5cf6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Top Performing Devices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Device</th>
                <th className="px-6 py-3 text-left text-gray-700">Messages</th>
                <th className="px-6 py-3 text-left text-gray-700">Uptime</th>
                <th className="px-6 py-3 text-left text-gray-700">Avg Latency</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Temperature Sensor #12', messages: 8420, uptime: '99.99%', latency: '98ms', status: 'Excellent' },
                { name: 'Motion Detector #05', messages: 7856, uptime: '99.95%', latency: '112ms', status: 'Excellent' },
                { name: 'Humidity Sensor #21', messages: 6234, uptime: '99.87%', latency: '128ms', status: 'Good' },
                { name: 'Smart Valve #08', messages: 5891, uptime: '99.92%', latency: '145ms', status: 'Good' },
                { name: 'Power Monitor #03', messages: 5124, uptime: '98.45%', latency: '189ms', status: 'Fair' },
              ].map((device, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{device.name}</td>
                  <td className="px-6 py-4 text-gray-700">{device.messages.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-700">{device.uptime}</td>
                  <td className="px-6 py-4 text-gray-700">{device.latency}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
                      device.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                      device.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
