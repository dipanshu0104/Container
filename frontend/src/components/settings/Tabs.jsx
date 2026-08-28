import { NavLink } from "react-router-dom";

const Tabs = () => {
  const tabs = [
    {
      label: "General",
      path: "/settings/general",
    },
    {
      label: "Security",
      path: "/settings/security",
    },
    {
      label: "Sessions",
      path: "/settings/sessions",
    },
    {
      label: "Advanced",
      path: "/settings/advanced",
    },
  ];

  return (
    <div className="flex justify-between flex-wrap gap-2 bg-neutral-900 p-1 rounded-xl w-full md:w-fit mb-8">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm transition ${
              isActive ? "bg-black" : "hover:bg-neutral-800"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default Tabs;