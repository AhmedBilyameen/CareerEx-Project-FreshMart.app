import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-green-600">FreshMart</Link>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
          <Link to="/shop" className="text-gray-700 hover:text-green-600">Shop</Link>
          <Link to="/cart" className="text-gray-700 hover:text-green-600">Cart</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
