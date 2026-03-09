import OpenSource from "./works/OpenSource";

export default function Work() {
  return (
    <section id="work" className="pb-16 px-5 sm:pb-24 sm:px-6">
      <div className="mb-6">
        <span className="section-label">Work</span>
      </div>

      {/* Tree: Work root */}
      <div className="flex">
        {/* Root vertical line */}
        <div className="flex flex-col items-center" style={{ width: 20, marginRight: 10 }}>
          <div className="w-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        <div className="flex-1 py-1">
          {/* Open Source label row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] text-white/30 uppercase tracking-widest">Open Source</span>
          </div>
          <OpenSource />
        </div>
      </div>
    </section>
  );
}
