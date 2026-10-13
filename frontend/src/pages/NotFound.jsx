import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>

      <p className="mt-3 text-gray-600">Sorry, this page doesn't exist.</p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        Back to Notes
      </Link>
    </main>
  );
}

export default NotFound;
