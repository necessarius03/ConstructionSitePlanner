// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import { Header, Sidebar } from './components/layout';

// Import pages
// import Dashboard from './pages/Dashboard';
// import SiteLayoutPage from './pages/site-layout/SiteLayoutPage';
// import EquipmentPage from './pages/equipment/EquipmentPage';
// import MaterialsPage from './pages/materials/MaterialsPage';
// import RoutesPage from './pages/routes/RoutesPage';
// import ReportsPage from './pages/reports/ReportsPage';

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} />
        <Layout>
          <Header collapsed={collapsed} toggleCollapsed={toggleSidebar} />
          <Content className="site-layout-content">
            <Routes>
              {/* Dashboard */}
              {/* <Route path="/" element={<Dashboard />} /> */}
              
              {/* Site Layout Management */}
              {/* <Route path="/site-layout" element={<SiteLayoutPage />} />
              <Route path="/site-layout/new" element={<SiteLayoutPage />} />
              <Route path="/site-layout/:id" element={<SiteLayoutPage />} /> */}
              
              {/* Equipment Management */}
              {/* <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/equipment/new" element={<EquipmentPage />} />
              <Route path="/equipment/:id" element={<EquipmentPage />} /> */}
              
              {/* Materials Management */}
              {/* <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/materials/new" element={<MaterialsPage />} />
              <Route path="/materials/:id" element={<MaterialsPage />} /> */}
              
              {/* Transportation Routes */}
              {/* <Route path="/routes" element={<RoutesPage />} />
              <Route path="/routes/new" element={<RoutesPage />} />
              <Route path="/routes/:id" element={<RoutesPage />} /> */}
              
              {/* Reports & Analytics */}
              {/* <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/:type" element={<ReportsPage />} /> */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;