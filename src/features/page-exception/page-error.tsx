export function PageError() {
  return (
    <>
      <div
        data-slot="page-error"
        className="bg-ikg-smoke-90 flex flex-1 flex-col items-center justify-center gap-4 text-center"
      >
        <h1 className="font-manrope text-ikg-yellow-100 text-[120px] font-extrabold uppercase">
          Oops
        </h1>
        <p className="font-manrope text-[14px] leading-[1.2] font-bold text-white uppercase">
          Something went wrong
        </p>
      </div>
    </>
  )
}
