import { Routes, Route } from 'react-router-dom'
import Dashboard from '../features/dashboard'
import DeviceDetails from '../pages/DeviceDetails'
import ProductList from '../features/product-mgmt/ProductList'
import ProductDetails from '../features/product-mgmt/ProductDetails'
import { AssetTreeManagement } from '../features/asset-management'
import RuleEngine from '../features/rule-engine'
import ThingModelEditor from '../features/product-mgmt/ThingModelEditor'
import TelemetryTrend from '../features/dashboard/TelemetryTrend'
import AlertsPanel from '../features/alert-center/AlertsPanel'
import DebugStatus from '../pages/DebugStatus'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/devices/:deviceId" element={<DeviceDetails />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/asset-tree" element={<AssetTreeManagement />} />
      <Route path="/rule-engine" element={<RuleEngine />} />
      <Route path="/products/model-editor" element={<ThingModelEditor />} />
      <Route path="/dashboard/telemetry" element={<TelemetryTrend />} />
      <Route path="/alerts" element={<AlertsPanel />} />
      <Route path="/debug" element={<DebugStatus />} />
    </Routes>
  )
}
