"use client";

import Script from "next/script";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

declare global {
  interface Window {
    selectProgram?: (pid: "men" | "women") => void;
    goHome?: () => void;
    navigate?: (dir: number) => void;
    completeAndNext?: () => void;
  }
}

export function ProgramShell() {
  // defensive: if this page unmounts, restore body scroll
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Sync Google Auth choice to user metadata
  useEffect(() => {
    async function syncGoogleAuth() {
      const intended = window.localStorage.getItem('intended_program');
      if (!intended) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !user.user_metadata?.program) {
        await supabase.auth.updateUser({
          data: { program: intended }
        });
        window.localStorage.removeItem('intended_program');
      }
    }
    syncGoogleAuth();
  }, []);

  return (
    <>
      {/* Load the full dataset first, then the DOM-based program logic */}
      <Script src="/program-data.js" strategy="afterInteractive" />
      <Script src="/program.js" strategy="afterInteractive" />

      <div id="splash">
        <div className="slogo">Vitality Institute</div>
        <h1 className="stitleMain">
          Your Transformation
          <br />
          Starts Here
        </h1>
        <p className="ssub">
          Science-backed programs for sexual health, hormonal balance, stamina,
          and intimate confidence.
        </p>
        <div className="pcards">
          <div
            className="pcard men"
            onClick={() => window.selectProgram?.("men")}
          >
            <div className="pc-icon">⚡</div>
            <div className="pc-title">
              Men&apos;s Vitality &
              <br />
              Performance
            </div>
            <p className="pc-sub">
              Rebuild testosterone, master ejaculatory control, and develop
              unshakeable sexual confidence through 4 science-backed phases.
            </p>
            <div className="pc-stats">
              <div className="pc-stat">
                <strong>10</strong>Modules
              </div>
              <div className="pc-stat">
                <strong>40+</strong>Lessons
              </div>
              <div className="pc-stat">
                <strong>4</strong>Phases
              </div>
            </div>
          </div>
          <div
            className="pcard women"
            onClick={() => window.selectProgram?.("women")}
          >
            <div className="pc-icon">🌸</div>
            <div className="pc-title">
              Feminine Vitality &
              <br />
              Intimate Health
            </div>
            <p className="pc-sub">
              Restore hormonal balance, strengthen pelvic health, and deepen
              intimate confidence through 4 science-backed phases.
            </p>
            <div className="pc-stats">
              <div className="pc-stat">
                <strong>8</strong>Modules
              </div>
              <div className="pc-stat">
                <strong>40+</strong>Lessons
              </div>
              <div className="pc-stat">
                <strong>4</strong>Phases
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="topbar" className="hidden-init">
        <div className="tb-left">
          <button id="menu-toggle" onClick={() => document.getElementById('sidebar')?.classList.toggle('open')} aria-label="Toggle Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button id="back-btn" onClick={() => window.goHome?.()}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="breadcrumb">
            <span className="ptag" id="bphase" />
            <span className="sep">›</span>
            <span id="bmodule" className="bmodule-text" />
          </div>
        </div>
        <div className="pswitcher">
          <button
            className="pbtn"
            id="btn-men"
            onClick={() => window.selectProgram?.("men")}
          >
            ⚡ Men&apos;s
          </button>
          <button
            className="pbtn"
            id="btn-women"
            onClick={() => window.selectProgram?.("women")}
          >
            🌸 Women&apos;s
          </button>
        </div>
      </div>

      <div id="app" className="hidden-init">
        <div id="sidebar">
          <div className="sh">
            <div className="ptitle" id="sptitle" />
            <div className="prowrap">
              <div className="prolabel">
                <span>Progress</span>
                <span id="ppct">0%</span>
              </div>
              <div className="probar">
                <div
                  className="profill profill-init"
                  id="pfill"
                />
              </div>
            </div>
          </div>
          <div className="snav" id="snav" />
        </div>
        <div id="main">
          <div id="content" />
        </div>
      </div>

      <div id="bnav" className="hidden-init">
        <button className="nprev" id="btn-prev" onClick={() => window.navigate?.(-1)}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="mhide">Prev</span><span className="mshow">ious Lesson</span>
        </button>
        <button className="ncomplete" id="btn-next" onClick={() => window.completeAndNext?.()}>
          <span className="mhide">Mark </span>Complete<span className="mhide"> &amp; Continue</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 12 4 18" />
          </svg>
        </button>
      </div>
    </>
  );
}


