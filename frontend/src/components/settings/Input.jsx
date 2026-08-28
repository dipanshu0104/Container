const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`text-sm bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

export default Input;