import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

function Navigation() {
  return (
    <nav className="bg-white w-64 p-4 border-r">
      <Link 
        to="/clients" 
        className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
      >
        <Users className="mr-2" size={20} />
        <span>Клиенты</span>
      </Link>
    </nav>
  );
}

export default Navigation; 