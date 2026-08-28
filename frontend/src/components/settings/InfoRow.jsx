const InfoRow = ({ label, value, valueClass = "" }) => (
  <div className="flex justify-between">
    <span className="text-gray-400">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);

export default InfoRow;