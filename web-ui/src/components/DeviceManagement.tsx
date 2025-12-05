import { useState, useEffect } from 'react';
import { Search, Plus, Thermometer, Droplets, Zap, Activity, Wifi, WifiOff, MoreVertical, Eye, RotateCw } from 'lucide-react';
import { Device, DeviceConfig, DeviceData, deviceApi } from '../api/deviceApi';

// 设备类型图标映射
const deviceTypeIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  power: Zap,
  motion: Activity,
  actuator: Activity
};

// 模拟设备数据
const mockDevices: Device[] = [
  {
    id: 'DEV001',
    name: 'Temperature Sensor #12',
    deviceModel: 'TS-100',
    serialNumber: 'TSN123456789',
    status: 1, // 在线
    ipAddress: '192.168.1.101',
    macAddress: '00:11:22:33:44:55',
    lastOnlineTime: '2024-01-15T14:30:00Z',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
    tags: ['temperature', 'sensor', 'indoor']
  },
  {
    id: 'DEV002',
    name: 'Humidity Sensor #21',
    deviceModel: 'HS-200',
    serialNumber: 'HSN987654321',
    status: 1, // 在线
    ipAddress: '192.168.1.102',
    macAddress: '00:11:22:33:44:56',
    lastOnlineTime: '2024-01-15T14:25:00Z',
    createdAt: '2023-12-02T11:00:00Z',
    updatedAt: '2024-01-09T14:20:00Z',
    tags: ['humidity', 'sensor', 'outdoor']
  },
  {
    id: 'DEV003',
    name: 'Power Monitor #03',
    deviceModel: 'PM-300',
    serialNumber: 'PMN135792468',
    status: 2, // 故障
    ipAddress: '192.168.1.103',
    macAddress: '00:11:22:33:44:57',
    lastOnlineTime: '2024-01-15T13:30:00Z',
    createdAt: '2023-12-03T12:00:00Z',
    updatedAt: '2024-01-08T13:10:00Z',
    tags: ['power', 'monitor', 'indoor']
  },
  {
    id: 'DEV004',
    name: 'Motion Detector #05',
    deviceModel: 'MD-400',
    serialNumber: 'MDN246813579',
    status: 1, // 在线
    ipAddress: '192.168.1.104',
    macAddress: '00:11:22:33:44:58',
    lastOnlineTime: '2024-01-15T14:31:00Z',
    createdAt: '2023-12-04T13:00:00Z',
    updatedAt: '2024-01-07T12:00:00Z',
    tags: ['motion', 'detector', 'security']
  },
  {
    id: 'DEV005',
    name: 'Temperature Sensor #13',
    deviceModel: 'TS-100',
    serialNumber: 'TSN123456790',
    status: 0, // 离线
    ipAddress: '192.168.1.105',
    macAddress: '00:11:22:33:44:59',
    lastOnlineTime: '2024-01-15T11:30:00Z',
    createdAt: '2023-12-05T14:00:00Z',
    updatedAt: '2024-01-06T11:30:00Z',
    tags: ['temperature', 'sensor', 'outdoor']
  },
  {
    id: 'DEV006',
    name: 'Smart Valve #08',
    deviceModel: 'SV-500',
    serialNumber: 'SVN369121518',
    status: 1, // 在线
    ipAddress: '192.168.1.106',
    macAddress: '00:11:22:33:44:60',
    lastOnlineTime: '2024-01-15T14:32:00Z',
    createdAt: '2023-12-06T15:00:00Z',
    updatedAt: '2024-01-05T10:15:00Z',
    tags: ['valve', 'actuator', 'water']
  },
  {
    id: 'DEV007',
    name: 'Humidity Sensor #22',
    deviceModel: 'HS-200',
    serialNumber: 'HSN987654322',
    status: 1, // 在线
    ipAddress: '192.168.1.107',
    macAddress: '00:11:22:33:44:61',
    lastOnlineTime: '2024-01-15T14:28:00Z',
    createdAt: '2023-12-07T16:00:00Z',
    updatedAt: '2024-01-04T09:45:00Z',
    tags: ['humidity', 'sensor', 'indoor']
  },
  {
    id: 'DEV008',
    name: 'Power Monitor #04',
    deviceModel: 'PM-300',
    serialNumber: 'PMN135792469',
    status: 1, // 在线
    ipAddress: '192.168.1.108',
    macAddress: '00:11:22:33:44:62',
    lastOnlineTime: '2024-01-15T14:29:00Z',
    createdAt: '2023-12-08T17:00:00Z',
    updatedAt: '2024-01-03T08:30:00Z',
    tags: ['power', 'monitor', 'outdoor']
  },
];

// 模拟设备实时数据
const mockDeviceData: Record<string, DeviceData> = {
  'DEV001': {
    deviceId: 'DEV001',
    timestamp: '2024-01-15T14:30:00Z',
    data: { temperature: 23.5, battery: 85 }
  },
  'DEV002': {
    deviceId: 'DEV002',
    timestamp: '2024-01-15T14:25:00Z',
    data: { humidity: 65, battery: 92 }
  },
  'DEV003': {
    deviceId: 'DEV003',
    timestamp: '2024-01-15T13:30:00Z',
    data: { power: 245, voltage: 220, battery: 45 }
  },
  'DEV004': {
    deviceId: 'DEV004',
    timestamp: '2024-01-15T14:31:00Z',
    data: { motion: 'detected', battery: 78 }
  },
  'DEV005': {
    deviceId: 'DEV005',
    timestamp: '2024-01-15T11:30:00Z',
    data: { temperature: 21.2, battery: 60 }
  },
  'DEV006': {
    deviceId: 'DEV006',
    timestamp: '2024-01-15T14:32:00Z',
    data: { status: 'open', battery: 95 }
  },
  'DEV007': {
    deviceId: 'DEV007',
    timestamp: '2024-01-15T14:28:00Z',
    data: { humidity: 58, battery: 88 }
  },
  'DEV008': {
    deviceId: 'DEV008',
    timestamp: '2024-01-15T14:29:00Z',
    data: { power: 189, voltage: 218, battery: 72 }
  },
};

export function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'warning'>('all');
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [deviceData, setDeviceData] = useState<Record<string, DeviceData>>(mockDeviceData);
  const [loading, setLoading] = useState(false);

  // 获取设备列表
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await deviceApi.getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      // 使用mock数据作为 fallback
      setDevices(mockDevices);
    } finally {
      setLoading(false);
    }
  };

  // 获取设备实时数据
  const fetchDeviceRealTimeData = async (deviceId: string) => {
    try {
      const data = await deviceApi.getDeviceRealTimeData(deviceId);
      setDeviceData(prev => ({ ...prev, [deviceId]: data }));
    } catch (error) {
      console.error(`Failed to fetch real-time data for device ${deviceId}:`, error);
      // 使用mock数据作为 fallback
      if (mockDeviceData[deviceId]) {
        setDeviceData(prev => ({ ...prev, [deviceId]: mockDeviceData[deviceId] }));
      }
    }
  };

  // 初始化加载设备列表
  useEffect(() => {
    fetchDevices();
  }, []);

  // 加载选中设备的实时数据
  useEffect(() => {
    if (selectedDevice) {
      fetchDeviceRealTimeData(selectedDevice.id);
    }
  }, [selectedDevice]);

  // 刷新设备列表
  const refreshDevices = () => {
    fetchDevices();
    // 刷新所有设备的实时数据
    devices.forEach(device => {
      fetchDeviceRealTimeData(device.id);
    });
  };

  // 设备状态映射
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'offline';
      case 1: return 'online';
      case 2: return 'warning';
      default: return 'unknown';
    }
  };

  // 过滤设备
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusText = getStatusText(device.status);
    const matchesFilter = filterStatus === 'all' || statusText === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 获取设备主要类型（用于显示图标）
  const getDeviceMainType = (tags: string[]): keyof typeof deviceTypeIcons => {
    for (const tag of tags) {
      if (tag in deviceTypeIcons) {
        return tag as keyof typeof deviceTypeIcons;
      }
    }
    return 'temperature'; // 默认图标
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Device Management</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your IoT devices</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshDevices}
            disabled={loading}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            title="Refresh Devices"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'online', 'offline', 'warning'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${filterStatus === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDevices.map((device) => {
          const statusText = getStatusText(device.status);
          const mainType = getDeviceMainType(device.tags || []);
          const Icon = deviceTypeIcons[mainType];
          const realTimeData = deviceData[device.id];
          
          return (
            <div key={device.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusText === 'online' ? 'bg-green-100' : statusText === 'offline' ? 'bg-gray-100' : 'bg-orange-100'}`}>
                  <Icon className={`w-6 h-6 ${statusText === 'online' ? 'text-green-600' : statusText === 'offline' ? 'text-gray-600' : 'text-orange-600'}`} />
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <h3 className="text-gray-900 mb-1">{device.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{device.id}</p>

              <div className="flex items-center gap-2 mb-4">
                {statusText === 'online' ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-sm ${statusText === 'online' ? 'text-green-600' : statusText === 'offline' ? 'text-gray-500' : 'text-orange-600'}`}>
                  {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">{device.lastOnlineTime ? new Date(device.lastOnlineTime).toLocaleTimeString() : 'Never'}</span>
              </div>

              {/* 显示实时数据 */}
              {realTimeData && Object.entries(realTimeData.data).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded p-3 mb-3">
                  <p className="text-sm text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                  <p className="text-gray-900">{value}{key === 'temperature' ? '°C' : key === 'humidity' ? '%' : key === 'power' ? 'W' : ''}</p>
                </div>
              ))}

              <button 
                onClick={() => setSelectedDevice(device)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Device Details Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedDevice(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Device Details</h3>
              <button onClick={() => setSelectedDevice(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Device Name</p>
                  <p className="text-gray-900 font-medium">{selectedDevice.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Device ID</p>
                  <p className="text-gray-900 font-mono text-sm">{selectedDevice.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Device Model</p>
                  <p className="text-gray-900">{selectedDevice.deviceModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="text-gray-900 font-mono text-sm">{selectedDevice.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getStatusText(selectedDevice.status) === 'online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusText(selectedDevice.status) === 'online' ? 'bg-green-600' : 'bg-orange-600'}`}></div>
                    {getStatusText(selectedDevice.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Online</p>
                  <p className="text-gray-900">{selectedDevice.lastOnlineTime ? new Date(selectedDevice.lastOnlineTime).toLocaleString() : 'Never'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">IP Address</p>
                  <p className="text-gray-900 font-mono text-sm">{selectedDevice.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">MAC Address</p>
                  <p className="text-gray-900 font-mono text-sm">{selectedDevice.macAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="text-gray-900">{selectedDevice.createdAt ? new Date(selectedDevice.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated At</p>
                  <p className="text-gray-900">{selectedDevice.updatedAt ? new Date(selectedDevice.updatedAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDevice.tags?.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {tag}
                      </span>
                    )) || <span className="text-gray-500 text-sm">No tags</span>}
                  </div>
                </div>
                
                {/* 实时数据 */}
                <div>
                  <p className="text-sm text-gray-600">Real-time Data</p>
                  {deviceData[selectedDevice.id] ? (
                    <div className="space-y-2 mt-1">
                      {Object.entries(deviceData[selectedDevice.id].data).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          <span className="text-gray-900 font-medium">{value}{key === 'temperature' ? '°C' : key === 'humidity' ? '%' : key === 'power' ? 'W' : ''}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg mt-1">
                      <span className="text-gray-500">No real-time data available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
