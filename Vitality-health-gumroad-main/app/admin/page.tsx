"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const ADMIN_EMAILS = new Set([
  "arkfiit@gmail.com",
  "abubakarbaluku5@gmail.com",
]);

type ProgramId = "men" | "women";

type PhaseRow = {
  id: string;
  program: ProgramId;
  phase_key: string;
  label: string;
  title: string;
  sort: number;
  status: "draft" | "published";
};

type ModuleRow = {
  id: string;
  program: ProgramId;
  phase_key: string;
  module_key: string;
  title: string;
  icon: string;
  sort: number;
  status: "draft" | "published";
};

type LessonRow = {
  id: string;
  program: ProgramId;
  module_key: string;
  lesson_key: string;
  title: string;
  duration: string;
  about: string;
  takeaways: unknown;
  blocks: unknown;
  video_url: string | null;
  sort: number;
  status: "draft" | "published";
};

type Block =
  | { type: "heading" | "subheading" | "smallheading" | "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "image"; url: string; alt?: string }
  | { type: "video"; url: string };

/** Extract iframe src from a pasted embed code, or return the string as-is if it's already a URL */
function extractEmbedUrl(raw: string): string {
  const trimmed = raw.trim();
  const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  return srcMatch ? srcMatch[1] : trimmed;
}

function asBlocks(x: unknown): Block[] {
  return Array.isArray(x) ? (x as Block[]) : [];
}

function asTakeaways(x: unknown): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)) : [];
}

function keySlug(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "_")
    .replaceAll(/^_+|_+$/g, "")
    .slice(0, 60);
}

export default function AdminPage() {
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const [program, setProgram] = useState<ProgramId>("men");
  const [phases, setPhases] = useState<PhaseRow[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);

  const [selectedPhaseKey, setSelectedPhaseKey] = useState<string | null>(null);
  const [selectedModuleKey, setSelectedModuleKey] = useState<string | null>(null);
  const [selectedLessonKey, setSelectedLessonKey] = useState<string | null>(null);

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const normalizedEmail = email?.toLowerCase() ?? null;
  const isAdmin = normalizedEmail ? ADMIN_EMAILS.has(normalizedEmail) : false;

  // Best-effort hard stop for non-admins (real protection is via Supabase RLS policies).
  useEffect(() => {
    if (authReady && email && !isAdmin) {
      supabase.auth.signOut().catch(() => {});
    }
  }, [authReady, email, isAdmin]);

  async function loadAll() {
    setStatus(null);
    const [p, m, l] = await Promise.all([
      supabase
        .from("program_phases")
        .select("id,program,phase_key,label,title,sort,status")
        .eq("program", program)
        .order("sort", { ascending: true }),
      supabase
        .from("program_modules")
        .select("id,program,phase_key,module_key,title,icon,sort,status")
        .eq("program", program)
        .order("sort", { ascending: true }),
      supabase
        .from("program_lessons")
        .select("id,program,module_key,lesson_key,title,duration,about,takeaways,blocks,video_url,sort,status")
        .eq("program", program)
        .order("sort", { ascending: true }),
    ]);
    if (p.error || m.error || l.error) {
      setStatus(p.error?.message || m.error?.message || l.error?.message || "Load failed");
      return;
    }
    setPhases((p.data ?? []) as PhaseRow[]);
    setModules((m.data ?? []) as ModuleRow[]);
    setLessons((l.data ?? []) as LessonRow[]);
  }

  useEffect(() => {
    if (!authReady) return;
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, program]);

  const phaseOptions = phases;
  const moduleOptions = useMemo(
    () => modules.filter((m) => (selectedPhaseKey ? m.phase_key === selectedPhaseKey : true)),
    [modules, selectedPhaseKey],
  );
  const lessonOptions = useMemo(
    () => lessons.filter((l) => (selectedModuleKey ? l.module_key === selectedModuleKey : true)),
    [lessons, selectedModuleKey],
  );

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.lesson_key === selectedLessonKey) ?? null,
    [lessons, selectedLessonKey],
  );

  const [draftTitle, setDraftTitle] = useState("");
  const [draftDuration, setDraftDuration] = useState("");
  const [draftVideoUrl, setDraftVideoUrl] = useState("");
  const [draftAbout, setDraftAbout] = useState("");
  const [draftTakeaways, setDraftTakeaways] = useState<string>("");
  const [draftBlocks, setDraftBlocks] = useState<Block[]>([]);
  const [draftStatus, setDraftStatus] = useState<"draft" | "published">("published");

  const [draftModuleKeyForLesson, setDraftModuleKeyForLesson] = useState("");
  const [draftPhaseLabel, setDraftPhaseLabel] = useState("");
  const [draftPhaseTitle, setDraftPhaseTitle] = useState("");
  const [draftModuleTitle, setDraftModuleTitle] = useState("");
  const [draftModuleIcon, setDraftModuleIcon] = useState("");

  useEffect(() => {
    if (!selectedPhaseKey) return;
    const p = phases.find((x) => x.phase_key === selectedPhaseKey);
    if (p) {
      setDraftPhaseLabel(p.label);
      setDraftPhaseTitle(p.title);
    }
  }, [selectedPhaseKey, phases]);

  useEffect(() => {
    if (!selectedModuleKey) return;
    const m = modules.find((x) => x.module_key === selectedModuleKey);
    if (m) {
      setDraftModuleTitle(m.title);
      setDraftModuleIcon(m.icon);
    }
  }, [selectedModuleKey, modules]);

  useEffect(() => {
    if (!selectedLesson) return;
    setDraftTitle(selectedLesson.title);
    setDraftModuleKeyForLesson(selectedLesson.module_key);
    setDraftDuration(selectedLesson.duration);
    setDraftVideoUrl(selectedLesson.video_url ?? "");
    setDraftAbout(selectedLesson.about);
    setDraftTakeaways(asTakeaways(selectedLesson.takeaways).join("\n"));
    setDraftBlocks(asBlocks(selectedLesson.blocks));
    setDraftStatus(selectedLesson.status);
  }, [selectedLesson]);

  async function addPhase() {
    const label = prompt("Phase label (e.g. PHASE 1)")?.trim();
    if (!label) return;
    const title = prompt("Phase title (e.g. Reset the Mind & Habits)")?.trim();
    if (!title) return;
    const phase_key = keySlug(`${label}_${title}`) || `phase_${Date.now()}`;
    const sort = (Math.max(0, ...phases.map((p) => p.sort)) || 0) + 10;
    const { error } = await supabase
      .from("program_phases")
      .insert([{ program, phase_key, label, title, sort, status: "published" }]);
    if (error) return setStatus(error.message);
    await loadAll();
    setSelectedPhaseKey(phase_key);
  }

  async function addModule() {
    if (!selectedPhaseKey) return setStatus("Select a phase first.");
    const title = prompt("Module title")?.trim();
    if (!title) return;
    const icon = prompt("Module icon (emoji)", "📘")?.trim() || "📘";
    const module_key = keySlug(title) || `module_${Date.now()}`;
    const sort =
      (Math.max(
        0,
        ...modules.filter((m) => m.phase_key === selectedPhaseKey).map((m) => m.sort),
      ) || 0) + 10;
    const { error } = await supabase.from("program_modules").insert([
      {
        program,
        phase_key: selectedPhaseKey,
        module_key,
        title,
        icon,
        sort,
        status: "published",
      },
    ]);
    if (error) return setStatus(error.message);
    await loadAll();
    setSelectedModuleKey(module_key);
  }

  async function addLesson() {
    if (!selectedModuleKey) return setStatus("Select a module first.");
    const title = prompt("Lesson title")?.trim();
    if (!title) return;
    const lesson_key = keySlug(title) || `lesson_${Date.now()}`;
    const sort =
      (Math.max(
        0,
        ...lessons.filter((l) => l.module_key === selectedModuleKey).map((l) => l.sort),
      ) || 0) + 10;
    const { error } = await supabase.from("program_lessons").insert([
      {
        program,
        module_key: selectedModuleKey,
        lesson_key,
        title,
        duration: "10:00",
        about: "",
        takeaways: [],
        blocks: [{ type: "paragraph", text: "Start writing your lesson here…" }],
        sort,
        status: "published",
      },
    ]);
    if (error) return setStatus(error.message);
    await loadAll();
    setSelectedLessonKey(lesson_key);
  }

  async function deletePhase() {
    if (!selectedPhaseKey) return;
    if (!confirm("Delete this Phase AND all its modules/lessons?")) return;
    setStatus("Deleting...");
    const { error } = await supabase.from("program_phases").delete().eq("phase_key", selectedPhaseKey).eq("program", program);
    if (error) return setStatus(error.message);
    setSelectedPhaseKey(null);
    setSelectedModuleKey(null);
    setSelectedLessonKey(null);
    await loadAll();
    setStatus("Phase deleted.");
  }

  async function togglePhaseStatus() {
    if (!selectedPhaseKey) return;
    const p = phases.find(x => x.phase_key === selectedPhaseKey);
    if (!p) return;
    const newStatus = p.status === 'draft' ? 'published' : 'draft';
    setStatus("Updating...");
    const { error } = await supabase.from("program_phases").update({ status: newStatus }).eq("id", p.id);
    if (error) return setStatus(error.message);
    await loadAll();
    setStatus("Phase status updated.");
  }

  async function deleteModule() {
    if (!selectedModuleKey) return;
    if (!confirm("Delete this Module AND all its lessons?")) return;
    setStatus("Deleting...");
    const { error } = await supabase.from("program_modules").delete().eq("module_key", selectedModuleKey).eq("program", program);
    if (error) return setStatus(error.message);
    setSelectedModuleKey(null);
    setSelectedLessonKey(null);
    await loadAll();
    setStatus("Module deleted.");
  }

  async function toggleModuleStatus() {
    if (!selectedModuleKey) return;
    const m = modules.find(x => x.module_key === selectedModuleKey);
    if (!m) return;
    const newStatus = m.status === 'draft' ? 'published' : 'draft';
    setStatus("Updating...");
    const { error } = await supabase.from("program_modules").update({ status: newStatus }).eq("id", m.id);
    if (error) return setStatus(error.message);
    await loadAll();
    setStatus("Module status updated.");
  }

  async function deleteLesson() {
    if (!selectedLesson) return;
    if (!confirm("Delete this Lesson?")) return;
    setStatus("Deleting...");
    const { error } = await supabase.from("program_lessons").delete().eq("id", selectedLesson.id);
    if (error) return setStatus(error.message);
    setSelectedLessonKey(null);
    await loadAll();
    setStatus("Lesson deleted.");
  }

  function addBlock(type: Block["type"]) {
    if (type === "image") {
      const url = prompt("Image URL")?.trim();
      if (!url) return;
      const alt = prompt("Alt text (optional)")?.trim() || "";
      setDraftBlocks((b) => [...b, { type: "image", url, alt }]);
      return;
    }
    if (type === "video") {
      const raw = prompt("Paste Streamable/YouTube embed code or direct URL\n\nExamples:\n• https://streamable.com/e/askv1d\n• Full <iframe> embed code from Streamable")?.trim();
      if (!raw) return;
      const url = extractEmbedUrl(raw);
      setDraftBlocks((b) => [...b, { type: "video", url }]);
      return;
    }
    if (type === "bullets") {
      setDraftBlocks((b) => [...b, { type: "bullets", items: ["First bullet", "Second bullet"] }]);
      return;
    }
    setDraftBlocks((b) => [...b, { type, text: "" }]);
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    setDraftBlocks((blocks) => {
      const next = [...blocks];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return blocks;
      const tmp = next[idx];
      next[idx] = next[j];
      next[j] = tmp;
      return next;
    });
  }

  function removeBlock(idx: number) {
    setDraftBlocks((b) => b.filter((_, i) => i !== idx));
  }

  async function savePhase() {
    if (!selectedPhaseKey) return;
    const p = phases.find((x) => x.phase_key === selectedPhaseKey);
    if (!p) return;
    setStatus("Saving Phase...");
    const { error } = await supabase
      .from("program_phases")
      .update({ label: draftPhaseLabel, title: draftPhaseTitle })
      .eq("id", p.id);
    if (error) return setStatus(error.message);
    setStatus("Saved.");
    await loadAll();
  }

  async function saveModule() {
    if (!selectedModuleKey) return;
    const m = modules.find((x) => x.module_key === selectedModuleKey);
    if (!m) return;
    setStatus("Saving Module...");
    const { error } = await supabase
      .from("program_modules")
      .update({ icon: draftModuleIcon, title: draftModuleTitle })
      .eq("id", m.id);
    if (error) return setStatus(error.message);
    setStatus("Saved.");
    await loadAll();
  }

  async function saveLesson() {
    if (!selectedLesson) return;
    setStatus(null);
    const takeaways = draftTakeaways
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("program_lessons")
      .update({
        module_key: draftModuleKeyForLesson.trim() || selectedLesson.module_key,
        title: draftTitle.trim() || selectedLesson.title,
        duration: draftDuration.trim() || selectedLesson.duration,
        video_url: draftVideoUrl.trim() || null,
        about: draftAbout,
        takeaways,
        blocks: draftBlocks,
        status: draftStatus,
      })
      .eq("id", selectedLesson.id);

    if (error) return setStatus(error.message);
    setStatus("Saved.");
    await loadAll();
  }

  if (!authReady) {
    return (
      <main className="admin-main">
        Loading…
      </main>
    );
  }

  if (!email) {
    return (
      <main className="admin-main">
        <h1 className="admin-h1">
          Admin
        </h1>
        <p className="admin-text-muted">
          Please log in from the homepage first.
        </p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-main">
        <h1 className="admin-h1">
          Admin
        </h1>
        <p className="admin-text-muted">
          Signed in as <strong className="admin-strong">{email}</strong>
        </p>
        <p className="admin-rose">
          This account is not an admin.
        </p>
      </main>
    );
  }

  return (
    <main className="admin-main-loaded">
      <div className="admin-flex-between">
        <div>
          <h1 className="admin-h1-large">
            Content Admin
          </h1>
          <p className="admin-text-muted-sm">
            Signed in as <strong className="admin-strong">{email}</strong>
          </p>
        </div>
        <div className="admin-flex-gap-10">
          <select
            title="Program"
            value={program}
            onChange={(e) => {
              setSelectedPhaseKey(null);
              setSelectedModuleKey(null);
              setSelectedLessonKey(null);
              setProgram(e.target.value as ProgramId);
            }}
            className="admin-select-btn"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <button className="btn-ghost" onClick={() => void supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </div>

      {status ? (
        <p className={`admin-status-text ${status === "Saved." ? "admin-status-success" : "admin-status-error"}`}>
          {status}
        </p>
      ) : null}

      <div className="admin-grid-layout">
        <aside className="admin-sidebar">
          <div className="admin-flex-wrap">
            <button className="btn-primary" onClick={() => void addPhase()}>
              + Phase
            </button>
            <button className="btn-primary" onClick={() => void addModule()}>
              + Module
            </button>
            <button className="btn-primary" onClick={() => void addLesson()}>
              + Lesson
            </button>
          </div>

          <div className="admin-mt-18">
            <div className="admin-label">
              Phase
            </div>
            <select
              title="Phase"
              value={selectedPhaseKey ?? ""}
              onChange={(e) => {
                setSelectedPhaseKey(e.target.value || null);
                setSelectedModuleKey(null);
                setSelectedLessonKey(null);
              }}
              className="admin-select-input"
            >
              <option value="">All</option>
              {phaseOptions.map((p) => (
                <option key={p.phase_key} value={p.phase_key}>
                  {p.status === "draft" ? "[DRAFT] " : ""}{p.label} — {p.title}
                </option>
              ))}
            </select>
            {selectedPhaseKey && (
              <div className="admin-action-row">
                 <button className="btn-ghost admin-action-btn" onClick={() => void togglePhaseStatus()}>
                   {phases.find(x => x.phase_key === selectedPhaseKey)?.status === 'draft' ? "Publish Phase" : "Revert to Draft"}
                 </button>
                 <button className="btn-ghost admin-action-btn-danger" onClick={() => void deletePhase()}>
                   Delete Phase
                 </button>
              </div>
            )}
          </div>

          <div className="admin-mt-14">
            <div className="admin-label-sm">
              Module
            </div>
            <select
              title="Module"
              value={selectedModuleKey ?? ""}
              onChange={(e) => {
                setSelectedModuleKey(e.target.value || null);
                setSelectedLessonKey(null);
              }}
              className="admin-select-input-mt"
            >
              <option value="">All</option>
              {moduleOptions.map((m) => (
                <option key={m.module_key} value={m.module_key}>
                  {m.status === "draft" ? "[DRAFT] " : ""}{m.icon} {m.title}
                </option>
              ))}
            </select>
            {selectedModuleKey && (
              <div className="admin-action-row-mt8">
                 <button className="btn-ghost admin-action-btn-flex" onClick={() => void toggleModuleStatus()}>
                   {modules.find(x => x.module_key === selectedModuleKey)?.status === 'draft' ? "Publish Module" : "Revert to Draft"}
                 </button>
                 <button className="btn-ghost admin-action-btn-flex-danger" onClick={() => void deleteModule()}>
                   Delete Module
                 </button>
              </div>
            )}
          </div>

          <div className="admin-mt-14">
            <div className="admin-label-sm">
              Lesson
            </div>
            <select
              title="Lesson"
              value={selectedLessonKey ?? ""}
              onChange={(e) => setSelectedLessonKey(e.target.value || null)}
              className="admin-select-input-mt"
            >
              <option value="">Select…</option>
              {lessonOptions.map((l) => (
                <option key={l.lesson_key} value={l.lesson_key}>
                  {l.status === "draft" ? "[DRAFT] " : ""}{l.title}
                </option>
              ))}
            </select>
            {selectedLessonKey && (
              <div className="admin-action-row-mt8">
                 <button className="btn-ghost admin-action-btn-flex-danger" onClick={() => void deleteLesson()}>
                   Delete Lesson
                 </button>
              </div>
            )}
          </div>
        </aside>

        <section className="admin-section">
          {!selectedPhaseKey && !selectedModuleKey && !selectedLesson ? (
            <div className="admin-empty-state">
              Select a Phase, Module, or Lesson from the sidebar to edit its details.
            </div>
          ) : selectedLesson ? (
            <>
              <div className="admin-flex-between" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600 }}>Edit Lesson</h2>
              </div>
              <div className="admin-grid-cols-3">
                <div>
                  <div className="admin-label">
                    Title
                  </div>
                  <input
                    title="Draft Title"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="admin-input-block"
                  />
                </div>
                <div>
                  <div className="admin-label">
                    Duration
                  </div>
                  <input
                    title="Draft Duration"
                    value={draftDuration}
                    onChange={(e) => setDraftDuration(e.target.value)}
                    className="admin-input-block"
                  />
                </div>
                <div>
                  <div className="admin-label">
                    Status
                  </div>
                  <select
                    title="Draft Status"
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value as "draft" | "published")}
                    className="admin-input-block"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="admin-mt-14">
                <div className="admin-label">
                  Assigned Module
                </div>
                <select
                  title="Assigned Module"
                  value={draftModuleKeyForLesson}
                  onChange={e => setDraftModuleKeyForLesson(e.target.value)}
                  className="admin-input-block"
                >
                  {modules.map(m => (
                    <option key={m.module_key} value={m.module_key}>
                      {m.icon} {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-mt-14">
                <div className="admin-label">
                  Lesson Video (paste Streamable embed code or URL)
                </div>
                <input
                  title="Lesson Video URL"
                  value={draftVideoUrl}
                  onChange={(e) => setDraftVideoUrl(extractEmbedUrl(e.target.value))}
                  placeholder="Paste full Streamable embed code or URL like https://streamable.com/e/xxxxx"
                  className="admin-input-block"
                />
                {draftVideoUrl ? (
                  <div className="admin-video-preview-wrapper">
                    <iframe
                      title="Lesson video preview"
                      src={draftVideoUrl}
                      className="admin-video-preview-iframe"
                      allow="fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p className="admin-video-empty-text">
                    No video set. Paste a Streamable embed code or direct URL above.
                  </p>
                )}
              </div>

              <div className="admin-mt-14">
                <div className="admin-label">
                  About
                </div>
                <textarea
                  title="Draft About"
                  value={draftAbout}
                  onChange={(e) => setDraftAbout(e.target.value)}
                  rows={3}
                  className="admin-textarea"
                />
              </div>

              <div className="admin-mt-14">
                <div className="admin-label">
                  Takeaways (one per line)
                </div>
                <textarea
                  title="Draft Takeaways"
                  value={draftTakeaways}
                  onChange={(e) => setDraftTakeaways(e.target.value)}
                  rows={4}
                  className="admin-textarea"
                />
              </div>

              <div className="admin-flex-wrap admin-mt-18">
                <button className="btn-ghost" onClick={() => addBlock("heading")}>
                  + Heading
                </button>
                <button className="btn-ghost" onClick={() => addBlock("subheading")}>
                  + Subheading
                </button>
                <button className="btn-ghost" onClick={() => addBlock("paragraph")}>
                  + Paragraph
                </button>
                <button className="btn-ghost" onClick={() => addBlock("bullets")}>
                  + Bullets
                </button>
                <button className="btn-ghost" onClick={() => addBlock("image")}>
                  + Image URL
                </button>
                <button className="btn-ghost" onClick={() => addBlock("video")}>
                  + Video Embed
                </button>
              </div>

              <div className="admin-mt-14 admin-grid-gap-12">
                {draftBlocks.map((b, idx) => (
                  <div
                    key={`${idx}-${b.type}-${"url" in b ? b.url : "text" in b ? b.text?.slice(0, 20) : idx}`}
                    className="admin-block"
                  >
                    <div className="admin-block-header">
                      <div className="admin-block-label">
                        {b.type}
                      </div>
                      <div className="admin-block-actions">
                        <button className="btn-ghost admin-action-btn" onClick={() => moveBlock(idx, -1)}>
                          ↑
                        </button>
                        <button className="btn-ghost admin-action-btn" onClick={() => moveBlock(idx, 1)}>
                          ↓
                        </button>
                        <button className="btn-ghost admin-action-btn" onClick={() => removeBlock(idx)}>
                          Remove
                        </button>
                      </div>
                    </div>

                    {"text" in b ? (
                      <textarea
                        title="Block Text"
                        value={b.text}
                        onChange={(e) => {
                          const text = e.target.value;
                          setDraftBlocks((blocks) =>
                            blocks.map((x, i) => (i === idx ? ({ ...x, text } as Block) : x)),
                          );
                        }}
                        rows={b.type === "paragraph" ? 4 : 2}
                        className="admin-textarea-block"
                      />
                    ) : null}

                    {b.type === "bullets" ? (
                      <textarea
                        title="Block Bullets"
                        value={b.items.join("\n")}
                        onChange={(e) => {
                          const items = e.target.value
                            .split("\n")
                            .map((l) => l.trim())
                            .filter(Boolean);
                          setDraftBlocks((blocks) =>
                            blocks.map((x, i) => (i === idx ? ({ ...x, items } as Block) : x)),
                          );
                        }}
                        rows={4}
                        className="admin-textarea-block"
                      />
                    ) : null}

                    {b.type === "image" ? (
                      <div className="admin-image-grid">
                        <input
                          title="Image URL"
                          value={b.url}
                          onChange={(e) => {
                            const url = e.target.value;
                            setDraftBlocks((blocks) =>
                              blocks.map((x, i) => (i === idx ? ({ ...x, url } as Block) : x)),
                            );
                          }}
                          placeholder="https://…"
                          className="admin-input-block"
                        />
                        <input
                          title="Image Alt Text"
                          value={b.alt ?? ""}
                          onChange={(e) => {
                            const alt = e.target.value;
                            setDraftBlocks((blocks) =>
                              blocks.map((x, i) => (i === idx ? ({ ...x, alt } as Block) : x)),
                            );
                          }}
                          placeholder="Alt text (optional)"
                          className="admin-input-block"
                        />
                      </div>
                    ) : null}

                  {b.type === "video" ? (
                    <div>
                      <input
                        title="Video Embed URL"
                        value={b.url}
                        onChange={(e) => {
                          const url = e.target.value;
                          setDraftBlocks((blocks) =>
                            blocks.map((x, i) => (i === idx ? ({ ...x, url } as Block) : x)),
                          );
                        }}
                        placeholder="https://streamable.com/e/xxxxx"
                        className="admin-input-block-mt"
                      />
                      {b.url ? (
                        <div className="admin-block-video-wrapper">
                          <iframe
                            title="Video preview"
                            src={b.url}
                            className="admin-video-preview-iframe"
                            allow="fullscreen"
                            allowFullScreen
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                ))}
              </div>

              <div className="admin-submit-row">
                <button className="btn-primary" onClick={() => void saveLesson()}>
                  Save lesson
                </button>
              </div>
            </>
          ) : selectedModuleKey ? (
            <div style={{ padding: 24, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
               <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Edit Module</h2>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                 <div>
                   <div className="admin-label">Icon (Emoji)</div>
                   <input title="Module Icon" value={draftModuleIcon} onChange={e => setDraftModuleIcon(e.target.value)} className="admin-input-block" />
                 </div>
                 <div>
                   <div className="admin-label">Title</div>
                   <input title="Module Title" value={draftModuleTitle} onChange={e => setDraftModuleTitle(e.target.value)} className="admin-input-block" />
                 </div>
               </div>
               <div style={{ marginTop: 24 }}>
                 <button className="btn-primary" onClick={() => void saveModule()}>Save Module</button>
               </div>
            </div>
          ) : selectedPhaseKey ? (
            <div style={{ padding: 24, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
               <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Edit Phase</h2>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                 <div>
                   <div className="admin-label">Label (e.g. PHASE 1)</div>
                   <input title="Phase Label" value={draftPhaseLabel} onChange={e => setDraftPhaseLabel(e.target.value)} className="admin-input-block" />
                 </div>
                 <div>
                   <div className="admin-label">Title</div>
                   <input title="Phase Title" value={draftPhaseTitle} onChange={e => setDraftPhaseTitle(e.target.value)} className="admin-input-block" />
                 </div>
               </div>
               <div style={{ marginTop: 24 }}>
                 <button className="btn-primary" onClick={() => void savePhase()}>Save Phase</button>
               </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

