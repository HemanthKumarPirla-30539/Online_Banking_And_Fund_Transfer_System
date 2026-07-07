import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4">404</h1>
      <p className="lead">Page not found. Please use the navigation to go back.</p>
      <Link className="btn btn-primary" to="/">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
