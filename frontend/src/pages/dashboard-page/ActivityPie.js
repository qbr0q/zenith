import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: '#javascript', value: 20 },
  { name: '#webdev', value: 45 },
  { name: '#reactjs', value: 80 },
  { name: '#career', value: 80 },
  { name: '#startup', value: 80 },
];

const COLORS = ['#10b981', '#ef4444', '#3b82f6'];

export const ActivityPie = () => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60} // Делает график "бубликом" (donut chart)
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </ResponsiveContainer>
  </div>
);