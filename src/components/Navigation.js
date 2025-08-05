import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Settings, Users, Coins } from 'lucide-react';

const Navigation = () => {
  const { isConnected } = useAccount();

  const navItems = [
    {
      path: '/users',
      label: 'Usuários',
      icon: Users,
      description: 'Comprar NFTs'
    },
    {
      path: '/tokens',
      label: 'Tokens',
      icon: Coins,
      description: 'Meus NFTs'
    },
    {
      path: '/admin',
      label: 'Administração',
      icon: Settings,
      description: 'Gerenciar sistema'
    }
  ];

  if (!isConnected) {
    return (
      <div className="bg-blue-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-blue-700">
              Conecte sua carteira para acessar o DApp
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <div className="hidden sm:block">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                <div className="sm:hidden font-medium">{item.label}</div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
