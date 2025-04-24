import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout';
import SiteLayoutPage from './pages/site-layout/SiteLayoutPage';

// Import pages
// Uncomment as they become available
// import Dashboard from './pages/dashboard/Dashboard';
// import EquipmentPage from './pages/equipment/EquipmentPage';
// import MaterialsPage from './pages/materials/MaterialsPage';
// import RoutesPage from './pages/routes/RoutesPage';
// import ReportsPage from './pages/reports/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<div>Dashboard (Coming Soon)</div>} />
          
          {/* Site Layout Management */}
          <Route path="/site-layout" element={<SiteLayoutPage />} />
          <Route path="/site-layout/:id" element={<SiteLayoutPage />} />
          
          {/* Equipment Management */}
          <Route path="/equipment" element={<div>Equipment Management (Coming Soon)</div>} />
          
          {/* Materials Management */}
          <Route path="/materials" element={<div>Materials Management (Coming Soon)</div>} />
          
          {/* Transportation Routes */}
          <Route path="/routes" element={<div>Transportation Routes (Coming Soon)</div>} />
          
          {/* Reports & Analytics */}
          <Route path="/reports" element={<div>Reports & Analytics (Coming Soon)</div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;