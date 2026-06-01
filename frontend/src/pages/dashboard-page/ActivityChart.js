import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
  { name: 'Нейросети', load: 20 },
  { name: 'Политика', load: 45 },
  { name: 'IT и разработка', load: 80 },
  { name: 'Психология', load: 80 },
  { name: 'Дизайн', load: 80 },
];

export const ActivityChart = () => (
  <div className="h-48 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Tooltip
          cursor={{ fill: '#f3f4f6' }}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          formatter={(value, name) => [value]}
        />
        <Bar dataKey="load" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        <XAxis dataKey="name" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);