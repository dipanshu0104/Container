import { useRef } from "react";

export const useLongPress = (
  onLongPress,
  onClick,
  isSelectionMode,
  delay = 600
) => {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  // ✅ NEW
  const startPos = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  const MOVE_THRESHOLD = 10; // px

  const isIgnoredTarget = (target) => {
    if (!target) return false;
    return target.closest?.("[data-no-longpress]");
  };

  /* ================= START ================= */

  const start = (e) => {
    if (isIgnoredTarget(e.target)) return;

    isLongPress.current = false;
    moved.current = false;

    // ✅ store touch start position
    if (e.touches?.[0]) {
      startPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }

    timerRef.current = setTimeout(() => {
      onLongPress(e);
      isLongPress.current = true;
    }, delay);
  };

  /* ================= MOVE ================= */

  const move = (e) => {
    if (!e.touches?.[0]) return;

    const dx = Math.abs(e.touches[0].clientX - startPos.current.x);
    const dy = Math.abs(e.touches[0].clientY - startPos.current.y);

    // ✅ if user scrolls → cancel everything
    if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
      moved.current = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  /* ================= END ================= */

  const clear = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isIgnoredTarget(e.target)) return;

    // ❌ if user scrolled → DO NOTHING
    if (moved.current) return;

    // ❌ if long press triggered → block click
    if (isLongPress.current) {
      e.preventDefault();
      return;
    }

    // ✅ selection mode → treat as select
    if (isSelectionMode) {
      e.preventDefault();
      onLongPress(e);
      return;
    }

    // ✅ normal click
    if (onClick) onClick(e);
  };

  /* ================= CANCEL ================= */

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  /* ================= RETURN ================= */

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: cancel,

    onTouchStart: start,
    onTouchMove: move,   // ✅ IMPORTANT
    onTouchEnd: clear,

    onContextMenu: (e) => e.preventDefault(),
  };
};