const StatCard = ({ title, value, variant = "default" }) => {
  const variantClasses = {
    default: "bg-white border-gray-200",
    dark: "bg-gray-900 border-gray-800 text-white",
    light: "bg-gray-50 border-gray-300",
    accent: "bg-black border-black text-white",
  };

  const bgClass = variantClasses[variant] || variantClasses.default;
  const isDark = variant === "dark" || variant === "accent";

  return (
    <div className={`${bgClass} border rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex-1 min-w-[200px] group relative overflow-hidden`}>
      {/* Subtle accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isDark ? 'bg-white' : 'bg-black'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative">
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </h3>
        <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} leading-tight`}>
          {value ?? "-"}
        </h2>
      </div>
      
      {/* Subtle bottom border on hover */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
    </div>
  );
};

export default StatCard;

