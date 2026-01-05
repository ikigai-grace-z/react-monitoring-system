export function PageNotFound() {
  return (
    <>
      <div
        data-slot="page-not-found"
        className="bg-ikg-smoke-90 flex flex-1 flex-col items-center justify-center gap-4"
      >
        <h1 className="font-manrope text-ikg-yellow-100 text-[120px] font-extrabold uppercase">
          404
        </h1>
        <p className="font-manrope text-[14px] font-bold text-white uppercase">
          Page not found
        </p>
      </div>
    </>
  )
}
