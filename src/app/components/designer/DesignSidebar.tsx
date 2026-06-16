import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings2,
  Palette,
  LayoutTemplate,
  FileDown,
  Trash2,
  Copy,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Camera,
  FileJson,
  Link2,
  MessageSquareQuote,
  X,
} from "lucide-react";
import {
  useDesignStore,
  MATERIALS,
  TEMPLATES,
  type DesignMaterial,
} from "../../../lib/designStore";

/* ─── Tab definitions ────────────────────────────────────────────────────── */

type TabId = "properties" | "materials" | "templates" | "export";

const TABS: { id: TabId; icon: React.ComponentType<any>; label: string }[] = [
  { id: "properties", icon: Settings2,        label: "Properties" },
  { id: "materials",  icon: Palette,           label: "Materials" },
  { id: "templates",  icon: LayoutTemplate,    label: "Templates" },
  { id: "export",     icon: FileDown,          label: "Export" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const panelBg = "rgba(10,10,30,0.9)";
const sectionTitle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.4)",
  margin: "12px 0 6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: 13,
  fontFamily: "'Inter', system-ui, sans-serif",
  outline: "none",
};

function DimInput({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, color, fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <button
          onClick={() => onChange(Math.max(10, value - 50))}
          style={{
            width: 22, height: 26, borderRadius: 4, border: "none",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Minus size={12} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(10, Number(e.target.value)))}
          style={{
            ...inputStyle,
            textAlign: "center",
            padding: "4px 2px",
            fontSize: 12,
            width: "100%",
          }}
        />
        <button
          onClick={() => onChange(value + 50)}
          style={{
            width: 22, height: 26, borderRadius: 4, border: "none",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}

/* ─── Properties Tab ─────────────────────────────────────────────────────── */

function PropertiesTab() {
  const sel = useDesignStore((s) => s.getSelectedObject());
  const updateObject = useDesignStore((s) => s.updateObject);
  const removeObject = useDesignStore((s) => s.removeObject);
  const duplicateObject = useDesignStore((s) => s.duplicateObject);
  const _pushHistory = useDesignStore((s) => s._pushHistory);

  if (!sel) {
    return (
      <div style={{ padding: 16, textAlign: "center", color: "rgba(255,255,255,0.35)" }}>
        <Settings2 size={36} style={{ margin: "20px auto 12px", opacity: 0.3 }} />
        <div style={{ fontSize: 13 }}>No object selected</div>
        <div style={{ fontSize: 11, marginTop: 4, opacity: 0.5 }}>
          Click an object to view its properties, or use a draw tool to create one
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    wall: "🧱 Wall Panel",
    panel: "📋 Flat Panel",
    box: "📦 Box / Locker",
    cylinder: "🔵 Column",
    door: "🚪 Door",
    shelf: "📚 Shelf",
  };

  return (
    <div style={{ padding: "8px 12px" }}>
      {/* Type badge */}
      <div
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: 6,
          background: "rgba(127,183,6,0.12)",
          color: "#7FB706",
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {typeLabels[sel.type] || sel.type}
      </div>

      {/* Name */}
      <input
        value={sel.name}
        onChange={(e) => updateObject(sel.id, { name: e.target.value })}
        style={{ ...inputStyle, marginBottom: 10 }}
      />

      {/* Position */}
      <div style={sectionTitle}>Position</div>
      <div style={{ display: "flex", gap: 6 }}>
        <DimInput label="X" value={Math.round(sel.position.x * 1000)} color="#ff6b6b"
          onChange={(v) => { _pushHistory(); updateObject(sel.id, { position: { ...sel.position, x: v / 1000 } }); }}
        />
        <DimInput label="Y" value={Math.round(sel.position.y * 1000)} color="#51cf66"
          onChange={(v) => { _pushHistory(); updateObject(sel.id, { position: { ...sel.position, y: v / 1000 } }); }}
        />
        <DimInput label="Z" value={Math.round(sel.position.z * 1000)} color="#74b9ff"
          onChange={(v) => { _pushHistory(); updateObject(sel.id, { position: { ...sel.position, z: v / 1000 } }); }}
        />
      </div>

      {/* Dimensions */}
      <div style={sectionTitle}>Dimensions (mm)</div>
      <div style={{ display: "flex", gap: 6 }}>
        <DimInput label="W" value={sel.dimensions.x} color="#ff6b6b"
          onChange={(v) => { _pushHistory(); updateObject(sel.id, { dimensions: { ...sel.dimensions, x: v } }); }}
        />
        <DimInput label="H" value={sel.dimensions.y} color="#51cf66"
          onChange={(v) => {
            _pushHistory();
            const newH = v;
            updateObject(sel.id, {
              dimensions: { ...sel.dimensions, y: newH },
              position: { ...sel.position, y: newH / 2000 },
            });
          }}
        />
        <DimInput label="D" value={sel.dimensions.z} color="#74b9ff"
          onChange={(v) => { _pushHistory(); updateObject(sel.id, { dimensions: { ...sel.dimensions, z: v } }); }}
        />
      </div>

      {/* Rotation (degrees) */}
      <div style={sectionTitle}>Rotation (°)</div>
      <div style={{ display: "flex", gap: 6 }}>
        {(["x", "y", "z"] as const).map((axis) => (
          <DimInput
            key={axis}
            label={axis.toUpperCase()}
            value={Math.round((sel.rotation[axis] * 180) / Math.PI)}
            color={axis === "x" ? "#ff6b6b" : axis === "y" ? "#51cf66" : "#74b9ff"}
            onChange={(deg) => {
              _pushHistory();
              updateObject(sel.id, {
                rotation: { ...sel.rotation, [axis]: (deg * Math.PI) / 180 },
              });
            }}
          />
        ))}
      </div>

      {/* Material dropdown */}
      <div style={sectionTitle}>Material</div>
      <select
        value={sel.materialId}
        onChange={(e) => {
          _pushHistory();
          const mat = MATERIALS.find((m) => m.id === e.target.value);
          if (mat) updateObject(sel.id, { materialId: mat.id, color: mat.color });
        }}
        style={{
          ...inputStyle,
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {MATERIALS.map((m) => (
          <option key={m.id} value={m.id} style={{ background: "#1a1a2e", color: "#fff" }}>
            {m.name}
          </option>
        ))}
      </select>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        <button
          onClick={() => duplicateObject(sel.id)}
          title="Duplicate"
          style={{
            flex: 1, padding: "7px 0", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)",
            cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 5,
          }}
        >
          <Copy size={14} /> Duplicate
        </button>
        <button
          onClick={() => {
            _pushHistory();
            updateObject(sel.id, { locked: !sel.locked });
          }}
          title={sel.locked ? "Unlock" : "Lock"}
          style={{
            width: 36, height: 36, borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)",
            background: sel.locked ? "rgba(255,183,6,0.12)" : "rgba(255,255,255,0.04)",
            color: sel.locked ? "#FFB706" : "rgba(255,255,255,0.5)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {sel.locked ? <Lock size={15} /> : <Unlock size={15} />}
        </button>
        <button
          onClick={() => removeObject(sel.id)}
          title="Delete"
          style={{
            width: 36, height: 36, borderRadius: 7, border: "1px solid rgba(255,80,80,0.2)",
            background: "rgba(255,60,60,0.08)", color: "#ff6b6b",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

/* ─── Materials Tab ──────────────────────────────────────────────────────── */

function MaterialsTab() {
  const activeMaterialId = useDesignStore((s) => s.activeMaterialId);
  const setActiveMaterial = useDesignStore((s) => s.setActiveMaterial);
  const setTool = useDesignStore((s) => s.setTool);

  const categories: { label: string; items: DesignMaterial[] }[] = [
    { label: "HPL Finishes",      items: MATERIALS.filter((m) => m.category === "hpl") },
    { label: "Hardware Finishes",  items: MATERIALS.filter((m) => m.category === "hardware") },
    { label: "Glass",              items: MATERIALS.filter((m) => m.category === "glass") },
    { label: "Metal",              items: MATERIALS.filter((m) => m.category === "metal") },
  ];

  return (
    <div style={{ padding: "8px 12px" }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
        Click a material then click objects to paint them
      </div>

      {categories.map((cat) => (
        <div key={cat.label}>
          <div style={sectionTitle}>{cat.label}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {cat.items.map((mat) => {
              const isActive = activeMaterialId === mat.id;
              return (
                <motion.button
                  key={mat.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    setActiveMaterial(mat.id);
                    setTool("paint");
                  }}
                  title={mat.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 8,
                    border: isActive ? "2px solid #7FB706" : "2px solid transparent",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    background: mat.color,
                    boxShadow: isActive ? "0 0 12px rgba(127,183,6,0.4)" : "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Metalness sheen overlay */}
                  {mat.metalness > 0.5 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent 60%)",
                        borderRadius: 6,
                      }}
                    />
                  )}
                  {/* Transparency indicator */}
                  {mat.opacity < 1 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                          "repeating-conic-gradient(rgba(255,255,255,0.1) 0% 25%, transparent 0% 50%)",
                        backgroundSize: "8px 8px",
                        borderRadius: 6,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Active material info */}
      {(() => {
        const mat = MATERIALS.find((m) => m.id === activeMaterialId);
        if (!mat) return null;
        return (
          <div
            style={{
              marginTop: 12,
              padding: "8px 10px",
              borderRadius: 8,
              background: "rgba(127,183,6,0.08)",
              border: "1px solid rgba(127,183,6,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: mat.color, flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{mat.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                {mat.category.toUpperCase()} · R{mat.roughness} · M{mat.metalness}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ─── Templates Tab ──────────────────────────────────────────────────────── */

function TemplatesTab() {
  const loadTemplate = useDesignStore((s) => s.loadTemplate);

  return (
    <div style={{ padding: "8px 12px" }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
        Load a pre-built product template to get started quickly
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {TEMPLATES.map((tmpl) => (
          <motion.button
            key={tmpl.id}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadTemplate(tmpl.id)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.03)",
              cursor: "pointer",
              textAlign: "left",
              color: "#fff",
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{tmpl.emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{tmpl.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                {tmpl.description} · {tmpl.objects.length} objects
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── Export Tab ──────────────────────────────────────────────────────────── */

function ExportTab() {
  const exportConfig = useDesignStore((s) => s.exportConfig);
  const objects = useDesignStore((s) => s.objects);
  const getObjectCount = useDesignStore((s) => s.getObjectCount);
  const projectName = useDesignStore((s) => s.projectName);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const counts = getObjectCount();

  const handleScreenshot = useCallback(() => {
    // Find the R3F canvas element and capture it
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${projectName.replace(/\s+/g, "_")}_design.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  }, [projectName]);

  const handleExportJSON = useCallback(() => {
    const json = exportConfig();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${projectName.replace(/\s+/g, "_")}_config.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportConfig, projectName]);

  const handleShareLink = useCallback(() => {
    const json = exportConfig();
    const encoded = btoa(json);
    const url = `${window.location.origin}/design-studio?config=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard!");
  }, [exportConfig]);

  const handleExportPDF = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF("landscape", "mm", "a4");

    // Header
    doc.setFillColor(3, 2, 19);
    doc.rect(0, 0, 297, 30, "F");
    doc.setTextColor(127, 183, 6);
    doc.setFontSize(18);
    doc.text("Pacific Products — Design Studio", 15, 18);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(projectName, 15, 25);

    // Screenshot
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png", 0.9);
      doc.addImage(imgData, "PNG", 10, 35, 170, 110);
    }

    // Summary table
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.text("Object Summary", 195, 42);
    let y = 50;
    doc.setFontSize(10);

    const typeLabels: Record<string, string> = {
      wall: "Wall Panels", panel: "Flat Panels", box: "Boxes/Lockers",
      cylinder: "Columns", door: "Doors", shelf: "Shelves",
    };

    Object.entries(counts).forEach(([type, count]) => {
      doc.text(`${typeLabels[type] || type}: ${count}`, 200, y);
      y += 8;
    });

    doc.text(`Total Objects: ${objects.length}`, 200, y + 4);

    // Object details
    y += 16;
    doc.setFontSize(11);
    doc.text("Detailed Specifications", 195, y);
    y += 8;
    doc.setFontSize(9);

    objects.slice(0, 15).forEach((obj) => {
      const dims = `${obj.dimensions.x}×${obj.dimensions.y}×${obj.dimensions.z}mm`;
      doc.text(`${obj.name} — ${dims}`, 200, y);
      y += 6;
      if (y > 190) {
        doc.addPage();
        y = 20;
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated ${new Date().toLocaleDateString()} | Pacific Products & Solutions | www.pacificproducts.in`,
      15, 200
    );

    doc.save(`${projectName.replace(/\s+/g, "_")}_specification.pdf`);
  }, [projectName, objects, counts]);

  const btnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'Inter', system-ui, sans-serif",
    textAlign: "left" as const,
    transition: "all 0.15s",
  };

  return (
    <div style={{ padding: "8px 12px" }}>
      {/* Object summary */}
      <div style={sectionTitle}>Scene Summary</div>
      <div
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 12,
        }}
      >
        {Object.entries(counts).length === 0 ? (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>No objects in scene</div>
        ) : (
          <>
            {Object.entries(counts).map(([type, count]) => (
              <div
                key={type}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                  padding: "3px 0",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{type}s</span>
                <span style={{ fontWeight: 600 }}>{count}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                marginTop: 6,
                paddingTop: 6,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 700,
                color: "#7FB706",
              }}
            >
              <span>Total</span>
              <span>{objects.length}</span>
            </div>
          </>
        )}
      </div>

      {/* Export buttons */}
      <div style={sectionTitle}>Export</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <button onClick={handleScreenshot} style={btnStyle}>
          <Camera size={16} /> PNG Screenshot
        </button>
        <button onClick={handleExportPDF} style={btnStyle}>
          <FileDown size={16} /> PDF Specification
        </button>
        <button onClick={handleExportJSON} style={btnStyle}>
          <FileJson size={16} /> JSON Config
        </button>
        <button onClick={handleShareLink} style={btnStyle}>
          <Link2 size={16} /> Copy Share Link
        </button>
      </div>

      {/* Quote CTA */}
      <div style={{ marginTop: 16 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowQuoteModal(true)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #7FB706, #5a8a04)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 20px rgba(127,183,6,0.3)",
          }}
        >
          <MessageSquareQuote size={18} /> Request Quote
        </motion.button>
      </div>

      {/* Quote Modal */}
      <AnimatePresence>
        {showQuoteModal && (
          <QuoteModal
            onClose={() => setShowQuoteModal(false)}
            config={exportConfig()}
            objectCount={objects.length}
            projectName={projectName}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Quote Modal ────────────────────────────────────────────────────────── */

function QuoteModal({
  onClose,
  config,
  objectCount,
  projectName,
}: {
  onClose: () => void;
  config: string;
  objectCount: number;
  projectName: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Submit via Web3Forms (same flow as existing configurator)
      const payload = new FormData();
      payload.append("access_key", "3e3c8393-92e9-4ef1-b498-cafed760b5ab");
      payload.append("subject", `Design Studio Quote: ${projectName}`);
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("message", `${form.message}\n\n--- Design Config ---\nProject: ${projectName}\nObjects: ${objectCount}\n\n${config}`);

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });

      setSent(true);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: "90vw",
          borderRadius: 16,
          background: "#0a0a1e",
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(127,183,6,0.15), transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Request a Quote</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              {projectName} · {objectCount} objects
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.5)", padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#7FB706" }}>
                Quote Request Submitted!
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
                Our team will review your design and respond within 24 hours.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle}
              />
              <textarea
                placeholder="Additional requirements or notes..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sending}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: sending
                    ? "rgba(127,183,6,0.3)"
                    : "linear-gradient(135deg, #7FB706, #5a8a04)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: sending ? "wait" : "pointer",
                }}
              >
                {sending ? "Submitting…" : "Submit Quote Request"}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Sidebar ───────────────────────────────────────────────────────── */

export function DesignSidebar() {
  const [activeTab, setActiveTab] = useState<TabId>("properties");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: collapsed ? 44 : 290,
        zIndex: 30,
        display: "flex",
        flexDirection: "row",
        transition: "width 0.3s ease",
      }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: 20,
          height: 40,
          alignSelf: "center",
          borderRadius: "6px 0 0 6px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRight: "none",
          background: "rgba(10,10,30,0.9)",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Panel */}
      <div
        style={{
          flex: 1,
          background: panelBg,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            display: collapsed ? "none" : "flex",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  background: isActive ? "rgba(127,183,6,0.08)" : "transparent",
                  borderBottom: isActive ? "2px solid #7FB706" : "2px solid transparent",
                  color: isActive ? "#7FB706" : "rgba(255,255,255,0.4)",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={16} />
                <span style={{ fontSize: 9, fontWeight: 600 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Collapsed icon strip */}
        {collapsed && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px 0",
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCollapsed(false);
                  }}
                  title={tab.label}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    background:
                      activeTab === tab.id ? "rgba(127,183,6,0.12)" : "transparent",
                    color:
                      activeTab === tab.id ? "#7FB706" : "rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        )}

        {/* Tab content */}
        {!collapsed && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {activeTab === "properties" && <PropertiesTab />}
            {activeTab === "materials" && <MaterialsTab />}
            {activeTab === "templates" && <TemplatesTab />}
            {activeTab === "export" && <ExportTab />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
