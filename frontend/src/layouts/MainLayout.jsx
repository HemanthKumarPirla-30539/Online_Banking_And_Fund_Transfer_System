import Sidebar from '../components/Sidebar';

function MainLayout({ children }) {
  return (
    <div className="row gx-4">
      <Sidebar />
      <div className="col-lg-9">{children}</div>
    </div>
  );
}

export default MainLayout;
