import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type ProgramId = "men" | "women";

type PhaseRow = {
  program: ProgramId;
  phase_key: string;
  label: string;
  title: string;
  sort: number;
};

type ModuleRow = {
  program: ProgramId;
  phase_key: string;
  module_key: string;
  title: string;
  icon: string;
  sort: number;
};

type LessonRow = {
  program: ProgramId;
  module_key: string;
  lesson_key: string;
  title: string;
  duration: string;
  about: string;
  takeaways: unknown; // jsonb
  blocks: unknown; // jsonb
  video_url: string | null;
  sort: number;
};

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** For URLs inside src="" — only escape quotes, preserve & for query params */
function escapeUrl(s: string) {
  return s
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "")
    .replaceAll(">", "");
}

function blockToHtml(block: unknown): string {
  if (!block || typeof block !== "object") return "";
  const b = block as Record<string, unknown>;
  const type = String(b.type || "");
  if (type === "heading") return `<div class="sh2">${escapeHtml(String(b.text || ""))}</div>`;
  if (type === "subheading") return `<div class="sh3">${escapeHtml(String(b.text || ""))}</div>`;
  if (type === "smallheading") return `<div class="sh4">${escapeHtml(String(b.text || ""))}</div>`;
  if (type === "paragraph") return `<p class="bt">${escapeHtml(String(b.text || ""))}</p>`;
  if (type === "bullets") {
    const items: unknown[] = Array.isArray(b.items) ? b.items : [];
    return `<ul class="blist">${items
      .map((i) => `<li><div class="bdot"></div><span>${escapeHtml(String(i))}</span></li>`)
      .join("")}</ul>`;
  }
  if (type === "image") {
    const url = String(b.url || "");
    const alt = escapeHtml(String(b.alt || ""));
    if (!url) return "";
    return `<div class="ibox"><div class="iboxlabel">Image</div><div style="margin-top:10px"><img src="${escapeUrl(
      url,
    )}" alt="${alt}" style="width:100%;max-width:820px;border-radius:14px;border:1px solid rgba(255,255,255,.12)" /></div></div>`;
  }
  if (type === "video") {
    const url = String(b.url || "");
    if (!url) return "";
    // embed via iframe src (Streamable/YouTube/Vimeo/etc). Admin provides a trusted embed URL.
    return `<div class="ibox"><div class="iboxlabel">Video</div><div style="margin-top:10px;position:relative;padding-top:56.25%;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12)"><iframe src="${escapeUrl(
      url,
    )}" style="position:absolute;inset:0;width:100%;height:100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen></iframe></div></div>`;
  }
  return "";
}

function blocksToBody(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks.map(blockToHtml).join("");
}

export async function GET() {
  const supabase = supabaseServer();

  const [{ data: phases, error: phasesError }, { data: modules, error: modulesError }, { data: lessons, error: lessonsError }] =
    await Promise.all([
      supabase
        .from("program_phases")
        .select("program,phase_key,label,title,sort")
        .eq("status", "published")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order("sort", { ascending: true }) as any,
      supabase
        .from("program_modules")
        .select("program,phase_key,module_key,title,icon,sort")
        .eq("status", "published")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order("sort", { ascending: true }) as any,
      supabase
        .from("program_lessons")
        .select("program,module_key,lesson_key,title,duration,about,takeaways,blocks,video_url,sort")
        .eq("status", "published")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order("sort", { ascending: true }) as any,
    ]);

  if (phasesError || modulesError || lessonsError) {
    return NextResponse.json(
      {
        error: "Failed to load program data",
        details: {
          phases: phasesError?.message,
          modules: modulesError?.message,
          lessons: lessonsError?.message,
        },
      },
      { status: 500 },
    );
  }

  const phasesRows = (phases ?? []) as PhaseRow[];
  const modulesRows = (modules ?? []) as ModuleRow[];
  const lessonsRows = (lessons ?? []) as LessonRow[];

  const lessonsByModule = new Map<string, LessonRow[]>();
  for (const l of lessonsRows) {
    const key = `${l.program}:${l.module_key}`;
    const list = lessonsByModule.get(key) ?? [];
    list.push(l);
    lessonsByModule.set(key, list);
  }

  const modulesByPhase = new Map<string, ModuleRow[]>();
  for (const m of modulesRows) {
    const key = `${m.program}:${m.phase_key}`;
    const list = modulesByPhase.get(key) ?? [];
    list.push(m);
    modulesByPhase.set(key, list);
  }

  const PROGRAMS: Record<string, object> = { men: { id: "men" }, women: { id: "women" } };
  (["men", "women"] as ProgramId[]).forEach((pid) => {
    PROGRAMS[pid] = {
      id: pid,
      label: pid === "men" ? "Men's Vitality & Performance" : "Feminine Vitality & Intimate Health",
      phases: phasesRows
        .filter((p) => p.program === pid)
        .map((p) => {
          const phaseModules = (modulesByPhase.get(`${pid}:${p.phase_key}`) ?? []).sort(
            (a, b) => a.sort - b.sort,
          );
          return {
            id: p.phase_key,
            label: p.label,
            title: p.title,
            modules: phaseModules.map((m) => {
              const ls = (lessonsByModule.get(`${pid}:${m.module_key}`) ?? []).sort(
                (a, b) => a.sort - b.sort,
              );
              return {
                id: m.module_key,
                title: m.title,
                icon: m.icon,
                lessons: ls.map((l) => ({
                  title: l.title,
                  duration: l.duration,
                  video_url: l.video_url || "",
                  phase: `${p.label} — ${p.title}`,
                  mod: `Module — ${m.title}`,
                  about: l.about,
                  takeaways: Array.isArray(l.takeaways) ? l.takeaways : [],
                  body: blocksToBody(l.blocks),
                  _key: l.lesson_key,
                })),
              };
            }),
          };
        }),
    };
  });

  return NextResponse.json({ PROGRAMS });
}

