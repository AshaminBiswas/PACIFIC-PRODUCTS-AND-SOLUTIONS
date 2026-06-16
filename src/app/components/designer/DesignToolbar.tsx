import { motion } from "motion/react";
import {
  MousePointer2,
  Move,
  RotateCcw,
  Maximize2,
  RectangleHorizontal,
  Square,
  Box,
  Circle,
  DoorOpen,
  Layers,
  Paintbrush,
  Eraser,
  Undo2,
  Redo2,
  Grid3x3,
  Ruler,
  Eye,
  EyeOff,
  MonitorUp,
  ArrowUp,
  ArrowRight as ArrowRightIcon,
  RotateCw,
} from "lucide-react";
import { useDesignStore, type ToolType, type CameraPreset } from "../../../lib/designStore";

/* ─── Tool definitions ──────────────────────────────────────────────────── */

interface ToolDef {
  id: ToolType;
  icon: React.ComponentType<any>;
  label: string;
  group: "select" | "draw" | "action";
  shortcut?: string;
}

const TOOLS: ToolDef[] = [
  { id: "select",        icon: MousePointer2,        label: "Select",       group: "select",  shortcut: "V" },
  { id: "move",          icon: Move,                 label: "Move",         group: "select",  shortcut: "G" },
  { id: "rotate",        icon: RotateCcw,            label: "Rotate",       group: "select",  shortcut: "R" },
  { id: "scale",         icon: Maximize2,            label: "Scale",        group: "select",  shortcut: "S" },
  { id: "draw_wall",     icon: RectangleHorizontal,  label: "Draw Wall",    group: "draw",    shortcut: "W" },
  { id: "draw_panel",    icon: Square,               label: "Draw Panel",   group: "draw",    shortcut: "P" },
  { id: "draw_box",      icon: Box,                  label: "Draw Box",     group: "draw",    shortcut: "B" },
  { id: "draw_cylinder", icon: Circle,               label: "Draw Column",  group: "draw",    shortcut: "C" },
  { id: "draw_door",     icon: DoorOpen,             label: "Draw Door",    group: "draw",    shortcut: "D" },
  { id: "draw_shelf",    icon: Layers,               label: "Add Shelf",    group: "draw" },
  { id: "paint",         icon: Paintbrush,           label: "Paint",        group: "action",  shortcut: "I" },
  { id: "eraser",        icon: Eraser,               label: "Delete",       group: "action",  shortcut: "X" },
];

const CAMERA_VIEWS: { id: CameraPreset; label: string; icon: React.ComponentType<any> }[] = [
  { id: "perspective", label: "3D View",   icon: RotateCw },
  { id: "front",       label: "Front",     icon: MonitorUp },
  { id: "top",         label: "Top",       icon: ArrowUp },
  { id: "side",        label: "Side",      icon: ArrowRightIcon },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

export function DesignToolbar() {
  const activeTool = useDesignStore((s) => s.activeTool);
  const setTool = useDesignStore((s) => s.setTool);
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const past = useDesignStore((s) => s.past);
  const future = useDesignStore((s) => s.future);
  const showGrid = useDesignStore((s) => s.showGrid);
  const toggleShowGrid = useDesignStore((s) => s.toggleShowGrid);
  const showDimensions = useDesignStore((s) => s.showDimensions);
  const toggleShowDimensions = useDesignStore((s) => s.toggleShowDimensions);
  const snapToGrid = useDesignStore((s) => s.snapToGrid);
  const toggleSnapToGrid = useDesignStore((s) => s.toggleSnapToGrid);
  const setCameraPreset = useDesignStore((s) => s.setCameraPreset);
  const cameraPreset = useDesignStore((s) => s.cameraPreset);

  // Group tools by category
  const selectTools = TOOLS.filter((t) => t.group === "select");
  const drawTools = TOOLS.filter((t) => t.group === "draw");
  const actionTools = TOOLS.filter((t) => t.group === "action");

  const renderToolButton = (tool: ToolDef) => {
    const Icon = tool.icon;
    const isActive = activeTool === tool.id;

    return (
      <motion.button
        key={tool.id}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTool(tool.id)}
        title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""}`}
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s ease",
          background: isActive
            ? "linear-gradient(135deg, #7FB706, #5a8a04)"
            : "rgba(255,255,255,0.04)",
          color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
          boxShadow: isActive ? "0 2px 10px rgba(127,183,6,0.35)" : "none",
        }}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      </motion.button>
    );
  };

  const divider = (
    <div
      style={{
        height: 1,
        margin: "4px 6px",
        background: "rgba(255,255,255,0.08)",
      }}
    />
  );

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: 14,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        padding: "8px 6px",
        borderRadius: 14,
        background: "rgba(10, 10, 30, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Selection / Transform tools */}
      {selectTools.map(renderToolButton)}
      {divider}

      {/* Drawing tools */}
      {drawTools.map(renderToolButton)}
      {divider}

      {/* Action tools */}
      {actionTools.map(renderToolButton)}
      {divider}

      {/* Undo / Redo */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={undo}
        disabled={past.length === 0}
        title="Undo (Ctrl+Z)"
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          cursor: past.length === 0 ? "not-allowed" : "pointer",
          background: "rgba(255,255,255,0.04)",
          color: past.length === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
        }}
      >
        <Undo2 size={17} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={redo}
        disabled={future.length === 0}
        title="Redo (Ctrl+Shift+Z)"
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          cursor: future.length === 0 ? "not-allowed" : "pointer",
          background: "rgba(255,255,255,0.04)",
          color: future.length === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
        }}
      >
        <Redo2 size={17} />
      </motion.button>

      {divider}

      {/* View toggles */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleShowGrid}
        title={showGrid ? "Hide Grid" : "Show Grid"}
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: showGrid ? "rgba(127,183,6,0.15)" : "rgba(255,255,255,0.04)",
          color: showGrid ? "#7FB706" : "rgba(255,255,255,0.4)",
        }}
      >
        <Grid3x3 size={17} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleShowDimensions}
        title={showDimensions ? "Hide Dimensions" : "Show Dimensions"}
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: showDimensions ? "rgba(127,183,6,0.15)" : "rgba(255,255,255,0.04)",
          color: showDimensions ? "#7FB706" : "rgba(255,255,255,0.4)",
        }}
      >
        <Ruler size={17} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSnapToGrid}
        title={snapToGrid ? "Disable Snap" : "Enable Snap"}
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: snapToGrid ? "rgba(127,183,6,0.15)" : "rgba(255,255,255,0.04)",
          color: snapToGrid ? "#7FB706" : "rgba(255,255,255,0.4)",
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {snapToGrid ? (
          <Eye size={17} />
        ) : (
          <EyeOff size={17} />
        )}
      </motion.button>

      {divider}

      {/* Camera presets */}
      {CAMERA_VIEWS.map((cv) => {
        const CamIcon = cv.icon;
        const isActive = cameraPreset === cv.id;
        return (
          <motion.button
            key={cv.id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCameraPreset(cv.id)}
            title={cv.label}
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: isActive ? "rgba(127,183,6,0.15)" : "rgba(255,255,255,0.04)",
              color: isActive ? "#7FB706" : "rgba(255,255,255,0.35)",
            }}
          >
            <CamIcon size={16} />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
