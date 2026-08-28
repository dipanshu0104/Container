import { motion } from "framer-motion";

const positions = [
  { x: 0, y: 0 },     // top-left
  { x: 30, y: 0 },    // top-right
  { x: 30, y: 30 },   // bottom-right
  { x: 0, y: 30 },    // bottom-left
];

const colors = ["#FB2C36", "#155DFC", "#22c55e", "#f59e0b"];

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-15 h-15">

        {positions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 rounded-sm"
            style={{
              backgroundColor: colors[i],
            }}
            animate={{
              x: [
                pos.x,
                positions[(i + 1) % 4].x,
                positions[(i + 2) % 4].x,
                positions[(i + 3) % 4].x,
                pos.x,
              ],
              y: [
                pos.y,
                positions[(i + 1) % 4].y,
                positions[(i + 2) % 4].y,
                positions[(i + 3) % 4].y,
                pos.y,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      </div>
    </div>
  );
};

export default LoadingSpinner;