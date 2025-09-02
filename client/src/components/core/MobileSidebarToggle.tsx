import { memo, useState, useRef, useCallback, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Icon } from "../ui/icon";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileSidebarToggleProps {
  draggable?: boolean;
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  offset?: number;
}

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const MobileSidebarToggle = memo(({ 
  draggable = false, 
  placement = "bottom-right",
  offset = 24
}: MobileSidebarToggleProps) => {
  const { toggleSidebar, openMobile } = useSidebar();
  const isMobile = useIsMobile();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [currentPlacement, setCurrentPlacement] = useState<CornerPosition>(placement);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [didDrag, setDidDrag] = useState(false);

  const getCornerPosition = useCallback((corner: CornerPosition) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonSize = 40;

    switch (corner) {
      case "top-left":
        return { x: offset, y: offset };
      case "top-right":
        return { x: viewportWidth - buttonSize - offset, y: offset };
      case "bottom-left":
        return { x: offset, y: viewportHeight - buttonSize - offset };
      case "bottom-right":
      default:
        return { x: viewportWidth - buttonSize - offset, y: viewportHeight - buttonSize - offset };
    }
  }, [offset]);

  const getNearestCorner = useCallback((x: number, y: number): CornerPosition => {
    const corners: CornerPosition[] = ["top-left", "top-right", "bottom-left", "bottom-right"];
    
    let nearestCorner: CornerPosition = "bottom-right";
    let minDistance = Infinity;

    corners.forEach(corner => {
      const cornerPos = getCornerPosition(corner);
      const distance = Math.sqrt(
        Math.pow(x - cornerPos.x, 2) + Math.pow(y - cornerPos.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestCorner = corner;
      }
    });

    return nearestCorner;
  }, [getCornerPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable) return;
    
    e.preventDefault();
    setDidDrag(false);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  }, [draggable]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!draggable) return;
    
    const touch = e.touches[0];
    setDidDrag(false);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY
    });
  }, [draggable]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragStart) return;

    const deltaX = Math.abs(clientX - dragStart.x);
    const deltaY = Math.abs(clientY - dragStart.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 5) {
      if (!isDragging) {
        setIsDragging(true);
        setDidDrag(true);
      }
      
      const nearestCorner = getNearestCorner(clientX, clientY);
      
      if (nearestCorner !== currentPlacement) {
        setCurrentPlacement(nearestCorner);
      }
    }
  }, [dragStart, isDragging, getNearestCorner, currentPlacement]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    const wasDragging = isDragging;
    setIsDragging(false);
    setDragStart(null);
    
    if (didDrag) {
      setTimeout(() => setDidDrag(false), 100);
    }
    
    return wasDragging;
  }, [isDragging, didDrag]);

  useEffect(() => {
    if (!dragStart) return;

    const touchMoveOptions = { passive: false };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, touchMoveOptions);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragStart, handleMouseMove, handleTouchMove, handleEnd]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!didDrag && !isDragging) {
      toggleSidebar();
    }
  }, [toggleSidebar, isDragging, didDrag]);

  if (!isMobile) {
    return null;
  }

  const getPositionClasses = () => {
    const positionClasses = {
      "top-left": "top-6 left-6",
      "top-right": "top-6 right-6", 
      "bottom-left": "bottom-6 left-6",
      "bottom-right": "bottom-6 right-6",
    };

    return positionClasses[currentPlacement];
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        touchAction: draggable ? 'none' : 'auto'
      }}
      className={cn(
        "fixed z-50",
        "h-12 w-12 rounded-full",
        "bg-primary/30 text-primary-",
        "shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "transition-all duration-300 ease-in-out",
        !isDragging && "hover:scale-105 active:scale-95",
        "border border-border/30",
        openMobile && "rotate-180",
        isDragging && "scale-110 shadow-2xl bg-primary/50",
        draggable && "cursor-move",
        getPositionClasses(),
        draggable && "select-none"
      )}
      aria-label={openMobile ? "Close sidebar" : "Open sidebar"}
    >
      <Icon 
        name={openMobile ? "X" : "Menu"} 
        className={cn(
          "h-5 w-5 transition-transform duration-200",
          openMobile && "rotate-180",
          "pointer-events-none"
        )} 
      />
      {/* Visual indicator for draggable state */}
      {draggable && isDragging && (
        <div className="absolute -inset-1 rounded-full border-2 border-primary/50 animate-pulse" />
      )}
    </button>
  );
});

MobileSidebarToggle.displayName = "MobileSidebarToggle";

export default MobileSidebarToggle;
