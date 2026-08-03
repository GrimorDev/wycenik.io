export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1.5 inline-flex align-middle">
      <button
        type="button"
        tabIndex={0}
        className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-line-strong text-[10px] font-medium text-ink-faint hover:border-rust hover:text-rust"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border border-line bg-paper-raised p-2.5 text-xs font-normal normal-case tracking-normal text-ink-soft opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
