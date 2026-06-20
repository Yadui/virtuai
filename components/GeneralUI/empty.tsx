interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-[#cfcdc4] bg-[#fafaf7] px-6 py-10">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-md border border-[#e6e5e0] bg-white text-sm font-semibold text-[#f54e00]">
        V
      </div>
      <p className="text-center text-sm text-[#807d72]">{label}</p>
    </div>
  );
};
