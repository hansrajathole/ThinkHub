import React from "react";
import { ArrowLeft, Clock3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComingSoon = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <main className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#f6f1e8] px-5 py-12 text-[#241c18] dark:bg-[#181715] dark:text-[#faf9f5] sm:px-8">
      <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-[#e8a55a]/30 blur-3xl dark:bg-[#cc785c]/20" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#5db8a6]/25 blur-3xl dark:bg-[#5db8a6]/10" />

      <section className="relative w-full max-w-2xl rounded-[2rem] border border-[#d8c9b9] bg-[#fffaf2]/85 p-7 text-center shadow-[0_24px_70px_rgba(86,61,42,0.16)] backdrop-blur sm:p-12 dark:border-[#3d3d3a] dark:bg-[#252320]/85 dark:shadow-black/30">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#241c18] text-[#f9e8ce] shadow-lg dark:bg-[#cc785c] dark:text-[#181715]">
          <Sparkles size={28} />
        </div>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#d8c9b9] bg-[#f6ead9] px-4 py-2 text-xs font-bold tracking-[0.18em] text-[#8d4c35] dark:border-[#5a463c] dark:bg-[#332923] dark:text-[#e8b78a]">
          <Clock3 size={14} />
          IN THE WORKS
        </p>

        <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#6d625a] sm:text-lg dark:text-[#c9c7c1]">
          {description}
        </p>

        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#241c18] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition hover:-translate-y-0.5 hover:bg-[#3b2b23] dark:bg-[#cc785c] dark:text-[#181715] dark:hover:bg-[#e8a55a]"
          >
            <ArrowLeft size={17} />
            Go back
          </button>
        </div>
      </section>
    </main>
  );
};

export default ComingSoon;
