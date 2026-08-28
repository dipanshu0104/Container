const Card = ({ title, subtitle, children, danger }) => (
  <div
    className={`rounded-2xl p-6 shadow-lg ${
      danger
        ? "bg-black border border-red-500"
        : "bg-neutral-950/70 border border-neutral-900"
    }`}
  >
    {title && <h2 className="text-lg font-semibold mb-1">{title}</h2>}

    {subtitle && (
      <p className="text-gray-400 text-sm mb-6">{subtitle}</p>
    )}

    {children}
  </div>
);

export default Card;