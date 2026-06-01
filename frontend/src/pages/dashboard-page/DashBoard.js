import { FiCpu, FiUsers, FiFileText, FiShieldOff, FiActivity } from 'react-icons/fi';
import { ActivityChart } from './ActivityChart'
import { ActivityPie } from './ActivityPie'
import { HomeButton } from './HomeButton'
import { UserManagement } from './UserManagement'


const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export const DashBoard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Панель управления</h1>
          <HomeButton/>
        </div>
      
      {/* Карточки с цифрами */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Использованные токены" value="14,200" icon={FiCpu} color="bg-blue-500" />
        <StatCard title="Активные юзеры" value="128" icon={FiUsers} color="bg-emerald-500" />
        <StatCard title="Новые посты" value="45" icon={FiFileText} color="bg-orange-500" />
        <StatCard title="Удаленные посты" value="2" icon={FiShieldOff} color="bg-red-500" />
      </div>

      {/* Пример блока "Нагрузка системы" */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <FiActivity className="text-purple-500" />
          <h2 className="font-bold text-lg">Системные метрики</h2>
        </div>
        <div className="flex flex-col gap-20">
            <ActivityChart/>
            <ActivityPie/>
        </div>
      </div>

      <UserManagement />
    </div>

  );
};