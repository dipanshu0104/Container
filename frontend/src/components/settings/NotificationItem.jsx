import Toggle from "./Toggle";

const NotificationItem = ({ title, desc }) => (
  <div className="flex items-center justify-between py-4 border-b border-neutral-800 last:border-none">
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>

    <Toggle />
  </div>
);

export default NotificationItem;