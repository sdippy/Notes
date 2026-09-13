export default function LayoutHeader() {
  return (
    <div className="h-16 w-full flex justify-between border-b border-border-subtle">
      <div className="flex items-center p-4 gap-3">
        <img src="/src/assets/Logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-[16px] font-semibold text-color-text-primary">
          Noteform
        </span>
      </div>
    </div>
  );
}
