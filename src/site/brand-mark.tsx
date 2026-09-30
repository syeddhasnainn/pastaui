import { LogoMark } from '#/site/brand/logo-mark'

export function BrandMark() {
  return (
    <span className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-[-0.025em]">
      <LogoMark size={22} />
      <span>PastaUI</span>
    </span>
  )
}
