import { create } from "zustand";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ObjectType =
  | "wall"
  | "panel"
  | "box"
  | "cylinder"
  | "door"
  | "shelf";

export type ToolType =
  | "select"
  | "move"
  | "rotate"
  | "scale"
  | "draw_wall"
  | "draw_panel"
  | "draw_box"
  | "draw_cylinder"
  | "draw_door"
  | "draw_shelf"
  | "paint"
  | "eraser";

export type CameraPreset = "front" | "top" | "side" | "perspective";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DesignMaterial {
  id: string;
  name: string;
  color: string;        // hex colour
  roughness: number;
  metalness: number;
  opacity: number;
  category: "hpl" | "hardware" | "glass" | "metal";
}

export interface DesignObject {
  id: string;
  type: ObjectType;
  name: string;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  dimensions: Vec3;     // width (x), height (y), depth (z) in mm
  materialId: string;
  color: string;
  locked: boolean;
  visible: boolean;
}

export interface DrawState {
  isDrawing: boolean;
  drawStart: Vec3 | null;
  drawPreview: Vec3 | null;
}

/* ─── Pre‑built Materials Library ────────────────────────────────────────── */

export const MATERIALS: DesignMaterial[] = [
  // HPL Finishes
  { id: "hpl_cream",     name: "HPL Cream",        color: "#F5F0E6", roughness: 0.6,  metalness: 0.0, opacity: 1.0, category: "hpl" },
  { id: "hpl_sage",      name: "Sage Green",       color: "#8BA888", roughness: 0.55, metalness: 0.0, opacity: 1.0, category: "hpl" },
  { id: "hpl_purple",    name: "Royal Purple",     color: "#6A3D8F", roughness: 0.55, metalness: 0.0, opacity: 1.0, category: "hpl" },
  { id: "hpl_oak",       name: "Natural Oak",      color: "#C4A46C", roughness: 0.7,  metalness: 0.0, opacity: 1.0, category: "hpl" },
  { id: "hpl_charcoal",  name: "Charcoal",         color: "#3A3A3A", roughness: 0.5,  metalness: 0.0, opacity: 1.0, category: "hpl" },
  { id: "hpl_white",     name: "Alpine White",     color: "#FAFAFA", roughness: 0.5,  metalness: 0.0, opacity: 1.0, category: "hpl" },
  { id: "hpl_navy",      name: "Deep Navy",        color: "#1B2A4A", roughness: 0.5,  metalness: 0.0, opacity: 1.0, category: "hpl" },
  { id: "hpl_terracotta", name: "Terracotta",      color: "#C06040", roughness: 0.6,  metalness: 0.0, opacity: 1.0, category: "hpl" },

  // Hardware Finishes
  { id: "hw_chrome",     name: "Chrome",           color: "#C8C8CC", roughness: 0.15, metalness: 0.95, opacity: 1.0, category: "hardware" },
  { id: "hw_brass",      name: "Brass",            color: "#D4A844", roughness: 0.25, metalness: 0.9,  opacity: 1.0, category: "hardware" },
  { id: "hw_matte_black", name: "Matte Black",     color: "#1A1A1A", roughness: 0.8,  metalness: 0.6,  opacity: 1.0, category: "hardware" },

  // Glass
  { id: "glass_frosted", name: "Frosted Glass",    color: "#E8EDF0", roughness: 0.3,  metalness: 0.0, opacity: 0.5, category: "glass" },
  { id: "glass_clear",   name: "Clear Glass",      color: "#D5E8F0", roughness: 0.05, metalness: 0.0, opacity: 0.3, category: "glass" },

  // Metal
  { id: "stainless",     name: "Stainless Steel",  color: "#B0B0B8", roughness: 0.2,  metalness: 0.9, opacity: 1.0, category: "metal" },
];

/* ─── Template Definitions ───────────────────────────────────────────────── */

export interface DesignTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  objects: Omit<DesignObject, "id">[];
}

function makeWall(
  x: number, z: number,
  w: number, h: number, d: number,
  ry: number = 0,
  mat: string = "hpl_cream"
): Omit<DesignObject, "id"> {
  return {
    type: "wall", name: "Wall Panel",
    position: { x, y: h / 2000, z },
    rotation: { x: 0, y: ry, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { x: w, y: h, z: d },
    materialId: mat, color: "#F5F0E6",
    locked: false, visible: true,
  };
}

function makeBox(
  x: number, z: number,
  w: number, h: number, d: number,
  mat: string = "hpl_cream"
): Omit<DesignObject, "id"> {
  return {
    type: "box", name: "Box",
    position: { x, y: h / 2000, z },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { x: w, y: h, z: d },
    materialId: mat, color: "#F5F0E6",
    locked: false, visible: true,
  };
}

function makeDoor(
  x: number, z: number,
  w: number, h: number, d: number,
  ry: number = 0,
  mat: string = "hpl_sage"
): Omit<DesignObject, "id"> {
  return {
    type: "door", name: "Door",
    position: { x, y: h / 2000, z },
    rotation: { x: 0, y: ry, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { x: w, y: h, z: d },
    materialId: mat, color: "#8BA888",
    locked: false, visible: true,
  };
}

export const TEMPLATES: DesignTemplate[] = [
  {
    id: "cubicle_2stall",
    name: "Toilet Cubicle (2-Stall)",
    emoji: "🚻",
    description: "Two-stall restroom cubicle layout with doors and divider",
    objects: [
      // Back wall
      makeWall(0, -0.75, 2200, 2000, 18),
      // Left wall
      makeWall(-1.1, 0, 18, 2000, 1500, 0, "hpl_cream"),
      // Right wall
      makeWall(1.1, 0, 18, 2000, 1500, 0, "hpl_cream"),
      // Centre divider
      makeWall(0, 0, 18, 2000, 1500, 0, "hpl_cream"),
      // Left door
      makeDoor(-0.55, 0.7, 900, 1800, 18),
      // Right door
      makeDoor(0.55, 0.7, 900, 1800, 18),
    ],
  },
  {
    id: "cubicle_3stall",
    name: "Toilet Cubicle (3-Stall)",
    emoji: "🚻",
    description: "Three-stall restroom cubicle with dividers and doors",
    objects: [
      makeWall(0, -0.75, 3300, 2000, 18),
      makeWall(-1.65, 0, 18, 2000, 1500),
      makeWall(1.65, 0, 18, 2000, 1500),
      makeWall(-0.55, 0, 18, 2000, 1500),
      makeWall(0.55, 0, 18, 2000, 1500),
      makeDoor(-1.1, 0.7, 900, 1800, 18),
      makeDoor(0, 0.7, 900, 1800, 18),
      makeDoor(1.1, 0.7, 900, 1800, 18),
    ],
  },
  {
    id: "shower_cubicle",
    name: "Shower Cubicle",
    emoji: "🚿",
    description: "Single shower enclosure with walls and door",
    objects: [
      makeWall(0, -0.5, 1000, 2100, 18),
      makeWall(-0.5, 0, 18, 2100, 1000),
      makeWall(0.5, 0, 18, 2100, 1000),
      makeDoor(0, 0.48, 850, 1900, 18, 0, "glass_frosted"),
    ],
  },
  {
    id: "locker_4x3",
    name: "Locker System (4×3)",
    emoji: "🔒",
    description: "4‑column × 3‑row locker bank",
    objects: Array.from({ length: 12 }, (_, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      return makeBox(
        (col - 1.5) * 0.42,
        0.05 + row * 0.55,
        400, 500, 450,
        "hpl_charcoal"
      );
    }).map((obj) => ({ ...obj, name: "Locker", position: { ...obj.position, y: obj.position.y } })),
  },
  {
    id: "partition_screen",
    name: "Partition Screen",
    emoji: "🏢",
    description: "Simple freestanding partition screen",
    objects: [
      makeWall(0, 0, 1200, 1400, 25, 0, "hpl_sage"),
    ],
  },
  {
    id: "wall_panel_layout",
    name: "Wall Panel Layout",
    emoji: "🧱",
    description: "Decorative wall panel arrangement",
    objects: [
      makeWall(-1.2, 0, 1100, 2400, 12, 0, "hpl_oak"),
      makeWall(0, 0, 1100, 2400, 12, 0, "hpl_navy"),
      makeWall(1.2, 0, 1100, 2400, 12, 0, "hpl_oak"),
    ],
  },
  {
    id: "full_restroom",
    name: "Full Restroom Layout",
    emoji: "🏗️",
    description: "Complete restroom with cubicles, partitions, and locker bank",
    objects: [
      // Back wall
      makeWall(0, -1.5, 5000, 2400, 20),
      // Side walls
      makeWall(-2.5, 0, 20, 2400, 3000),
      makeWall(2.5, 0, 20, 2400, 3000),
      // 3 cubicle stalls on the left
      makeWall(-2.0, -0.25, 18, 2000, 1500),
      makeWall(-1.0, -0.25, 18, 2000, 1500),
      makeDoor(-1.5, 0.5, 850, 1800, 18),
      makeDoor(-0.5, 0.5, 850, 1800, 18),
      // Locker row on the right
      ...Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return {
          ...makeBox(
            1.5 + (col - 1) * 0.42,
            0.05 + row * 0.55,
            400, 500, 450,
            "hpl_charcoal"
          ),
          name: "Locker",
        };
      }),
    ],
  },
];

/* ─── Store Interface ────────────────────────────────────────────────────── */

interface HistorySnapshot {
  objects: DesignObject[];
  selectedId: string | null;
}

interface DesignState {
  // Data
  objects: DesignObject[];
  selectedId: string | null;
  activeTool: ToolType;
  activeMaterialId: string;
  drawState: DrawState;

  // History
  past: HistorySnapshot[];
  future: HistorySnapshot[];

  // View
  cameraPreset: CameraPreset;
  cameraResetKey: number;
  gridSize: number;     // mm
  snapToGrid: boolean;
  showGrid: boolean;
  showDimensions: boolean;

  // Project
  projectName: string;

  // Actions
  addObject: (obj: Omit<DesignObject, "id">) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, patch: Partial<DesignObject>) => void;
  duplicateObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  setTool: (tool: ToolType) => void;
  setActiveMaterial: (materialId: string) => void;
  paintObject: (id: string) => void;

  // Drawing
  startDraw: (pos: Vec3) => void;
  updateDrawPreview: (pos: Vec3) => void;
  finishDraw: (pos: Vec3) => void;
  cancelDraw: () => void;

  // History
  undo: () => void;
  redo: () => void;
  _pushHistory: () => void;

  // View
  setCameraPreset: (preset: CameraPreset) => void;
  resetCamera: () => void;
  setGridSize: (size: number) => void;
  toggleSnapToGrid: () => void;
  toggleShowGrid: () => void;
  toggleShowDimensions: () => void;

  // Project
  setProjectName: (name: string) => void;
  clearAll: () => void;
  loadTemplate: (templateId: string) => void;
  exportConfig: () => string;
  importConfig: (json: string) => void;

  // Helpers
  getObjectCount: () => Record<string, number>;
  getSelectedObject: () => DesignObject | null;
  snap: (v: number) => number;
}

/* ─── Helper ─────────────────────────────────────────────────────────────── */

let _nextId = 1;
function genId(): string {
  return `obj_${Date.now()}_${_nextId++}`;
}

const TOOL_TO_TYPE: Partial<Record<ToolType, ObjectType>> = {
  draw_wall: "wall",
  draw_panel: "panel",
  draw_box: "box",
  draw_cylinder: "cylinder",
  draw_door: "door",
  draw_shelf: "shelf",
};

const TYPE_DEFAULTS: Record<ObjectType, { dimensions: Vec3; name: string; material: string }> = {
  wall:     { dimensions: { x: 1200, y: 2000, z: 18 },  name: "Wall Panel",    material: "hpl_cream" },
  panel:    { dimensions: { x: 600,  y: 800,  z: 12 },  name: "Flat Panel",    material: "hpl_sage" },
  box:      { dimensions: { x: 500,  y: 600,  z: 450 }, name: "Box",           material: "hpl_charcoal" },
  cylinder: { dimensions: { x: 200,  y: 1200, z: 200 }, name: "Column",        material: "stainless" },
  door:     { dimensions: { x: 800,  y: 1800, z: 18 },  name: "Door",          material: "hpl_sage" },
  shelf:    { dimensions: { x: 500,  y: 18,   z: 400 }, name: "Shelf",         material: "hpl_oak" },
};

/* ─── Store ──────────────────────────────────────────────────────────────── */

export const useDesignStore = create<DesignState>((set, get) => ({
  objects: [],
  selectedId: null,
  activeTool: "select",
  activeMaterialId: "hpl_cream",
  drawState: { isDrawing: false, drawStart: null, drawPreview: null },

  past: [],
  future: [],

  cameraPreset: "perspective",
  cameraResetKey: 0,
  gridSize: 100,
  snapToGrid: true,
  showGrid: true,
  showDimensions: true,

  projectName: "Untitled Design",

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  snap: (v: number) => {
    const { snapToGrid, gridSize } = get();
    if (!snapToGrid) return v;
    const step = gridSize / 1000; // convert mm → metres
    return Math.round(v / step) * step;
  },

  getSelectedObject: () => {
    const { objects, selectedId } = get();
    return objects.find((o) => o.id === selectedId) ?? null;
  },

  getObjectCount: () => {
    const counts: Record<string, number> = {};
    get().objects.forEach((o) => {
      counts[o.type] = (counts[o.type] || 0) + 1;
    });
    return counts;
  },

  /* ── Object CRUD ─────────────────────────────────────────────────────── */

  addObject: (obj) => {
    const id = genId();
    get()._pushHistory();
    set((s) => ({
      objects: [...s.objects, { ...obj, id }],
      selectedId: id,
      future: [],
    }));
  },

  removeObject: (id) => {
    get()._pushHistory();
    set((s) => ({
      objects: s.objects.filter((o) => o.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
      future: [],
    }));
  },

  updateObject: (id, patch) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  },

  duplicateObject: (id) => {
    const obj = get().objects.find((o) => o.id === id);
    if (!obj) return;
    get()._pushHistory();
    const newId = genId();
    const clone: DesignObject = {
      ...obj,
      id: newId,
      name: `${obj.name} (copy)`,
      position: { ...obj.position, x: obj.position.x + 0.3 },
    };
    set((s) => ({
      objects: [...s.objects, clone],
      selectedId: newId,
      future: [],
    }));
  },

  selectObject: (id) => set({ selectedId: id }),

  /* ── Tools ───────────────────────────────────────────────────────────── */

  setTool: (tool) => set({ activeTool: tool, selectedId: tool === "select" ? get().selectedId : null }),

  setActiveMaterial: (materialId) => set({ activeMaterialId: materialId }),

  paintObject: (id) => {
    const { activeMaterialId } = get();
    const mat = MATERIALS.find((m) => m.id === activeMaterialId);
    if (!mat) return;
    get()._pushHistory();
    set((s) => ({
      objects: s.objects.map((o) =>
        o.id === id ? { ...o, materialId: activeMaterialId, color: mat.color } : o
      ),
      future: [],
    }));
  },

  /* ── Drawing ─────────────────────────────────────────────────────────── */

  startDraw: (pos) => {
    set({ drawState: { isDrawing: true, drawStart: pos, drawPreview: pos } });
  },

  updateDrawPreview: (pos) => {
    set((s) => ({
      drawState: { ...s.drawState, drawPreview: pos },
    }));
  },

  finishDraw: (pos) => {
    const { drawState, activeTool, snap, activeMaterialId } = get();
    const objType = TOOL_TO_TYPE[activeTool];
    if (!objType || !drawState.drawStart) {
      set({ drawState: { isDrawing: false, drawStart: null, drawPreview: null } });
      return;
    }

    const start = drawState.drawStart;
    const end = { x: snap(pos.x), y: snap(pos.y), z: snap(pos.z) };
    const defaults = TYPE_DEFAULTS[objType];
    const mat = MATERIALS.find((m) => m.id === activeMaterialId) ?? MATERIALS.find((m) => m.id === defaults.material)!;

    // Calculate dimensions from drag
    const dx = Math.abs(end.x - start.x);
    const dz = Math.abs(end.z - start.z);

    // Use drag distance for wall/panel width, or defaults for click-placement
    let dims = { ...defaults.dimensions };
    if (dx > 0.05 || dz > 0.05) {
      // User dragged — compute dimensions from drag vector
      if (objType === "wall" || objType === "panel" || objType === "door") {
        dims.x = Math.max(100, Math.round(Math.max(dx, dz) * 1000));
      } else if (objType === "box") {
        dims.x = Math.max(100, Math.round(dx * 1000));
        dims.z = Math.max(100, Math.round(dz * 1000));
      }
    }

    const cx = (start.x + end.x) / 2;
    const cz = (start.z + end.z) / 2;
    const ry = dz > dx ? Math.PI / 2 : 0;

    get().addObject({
      type: objType,
      name: defaults.name,
      position: { x: cx, y: dims.y / 2000, z: cz },
      rotation: { x: 0, y: objType === "cylinder" ? 0 : ry, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      dimensions: dims,
      materialId: mat.id,
      color: mat.color,
      locked: false,
      visible: true,
    });

    set({ drawState: { isDrawing: false, drawStart: null, drawPreview: null } });
  },

  cancelDraw: () => {
    set({ drawState: { isDrawing: false, drawStart: null, drawPreview: null } });
  },

  /* ── History (undo / redo) ───────────────────────────────────────────── */

  _pushHistory: () => {
    const { objects, selectedId, past } = get();
    const snapshot: HistorySnapshot = {
      objects: objects.map((o) => ({ ...o })),
      selectedId,
    };
    set({ past: [...past.slice(-49), snapshot] }); // cap history at 50
  },

  undo: () => {
    const { past, objects, selectedId, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      objects: prev.objects,
      selectedId: prev.selectedId,
      past: past.slice(0, -1),
      future: [{ objects: objects.map((o) => ({ ...o })), selectedId }, ...future],
    });
  },

  redo: () => {
    const { future, objects, selectedId, past } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      objects: next.objects,
      selectedId: next.selectedId,
      future: future.slice(1),
      past: [...past, { objects: objects.map((o) => ({ ...o })), selectedId }],
    });
  },

  /* ── View ─────────────────────────────────────────────────────────────── */

  setCameraPreset: (preset) => set({ cameraPreset: preset, cameraResetKey: get().cameraResetKey + 1 }),
  resetCamera: () => set((s) => ({ cameraResetKey: s.cameraResetKey + 1 })),
  setGridSize: (size) => set({ gridSize: size }),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleShowDimensions: () => set((s) => ({ showDimensions: !s.showDimensions })),

  /* ── Project ─────────────────────────────────────────────────────────── */

  setProjectName: (name) => set({ projectName: name }),

  clearAll: () => {
    get()._pushHistory();
    set({ objects: [], selectedId: null, future: [] });
  },

  loadTemplate: (templateId) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    get()._pushHistory();
    const loaded = template.objects.map((o) => ({
      ...o,
      id: genId(),
    }));
    set({
      objects: loaded,
      selectedId: null,
      future: [],
      activeTool: "select",
    });
  },

  exportConfig: () => {
    const { objects, projectName } = get();
    return JSON.stringify({ projectName, objects, version: 1 }, null, 2);
  },

  importConfig: (json) => {
    try {
      const data = JSON.parse(json);
      if (!data.objects || !Array.isArray(data.objects)) return;
      get()._pushHistory();
      set({
        objects: data.objects.map((o: any) => ({ ...o, id: o.id || genId() })),
        projectName: data.projectName || "Imported Design",
        selectedId: null,
        future: [],
      });
    } catch {
      /* silently ignore bad JSON */
    }
  },
}));
