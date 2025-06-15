// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout.tsx'
// import Dashboard from './pages/Dashboard.tsx'
// import RegisterComplaint from './pages/RegisterComplaint.tsx'
// import Home from './pages/Home.tsx'
// import CurrentComplaints from './pages/CurrentComplaints.tsx'
// import PreviousComplaints from './pages/PreviousComplaints.tsx'
// import Suggestions from './pages/Suggestions.tsx'

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/register-complaint" element={<RegisterComplaint />} />
//           <Route path="/current-complaints" element={<CurrentComplaints />} />
//           <Route path="/previous-complaints" element={<PreviousComplaints />} />
//           <Route path="/suggestions" element={<Suggestions />} />
//         </Routes>
//       </Layout>
//     </Router>
//   )
// }

// export default App
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import RegisterComplaint from './pages/RegisterComplaint'
import CurrentComplaints from './pages/CurrentComplaints'
import PreviousComplaints from './pages/PreviousComplaints'
import Suggestions from './pages/Suggestions'
import AdminDashboard from './pages/admin/Dashboard'
import WorkerManagement from './pages/admin/WorkerManagement'
import ComplaintManagement from './pages/admin/ComplaintManagement'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register-complaint" element={<RegisterComplaint />} />
          <Route path="/current-complaints" element={<CurrentComplaints />} />
          <Route path="/previous-complaints" element={<PreviousComplaints />} />
          <Route path="/suggestions" element={<Suggestions />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/workers" element={<WorkerManagement />} />
          <Route path="/admin/complaints" element={<ComplaintManagement />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App