const StatCard = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    red: "bg-red-50 border-red-200 text-red-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  const bgClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${bgClass} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex-1 min-w-[200px]`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-80 uppercase tracking-wide">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <h2 className="text-3xl font-bold">{value ?? "-"}</h2>
    </div>
  );
};

export default StatCard;

