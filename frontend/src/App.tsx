import { BrowserRouter as Router } from 'react-router-dom';
// import AdminRoutes from './routes/AdminRoutes';
import MainRoutes from './routes/MainRoutes';

function App() {
  return (
    <Router>
      <div>
        {/* <AdminRoutes /> */}
        <MainRoutes />
      </div>
    </Router>
  );
}

export default App;
