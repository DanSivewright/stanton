export function DottedRule() {
  return (
    <div className="relative h-0 w-full">
      <div
        className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 text-stroke-soft-200"
        style={{
          background:
            "linear-gradient(90deg, currentcolor 4px, transparent 4px) 50% 50% / 10px 1px repeat-x",
        }}
      />
    </div>
  );
}
