import { Container } from "@/src/components/layout/Container";
import { Marquee } from "@/src/components/ui/Marquee";

const issuers = ["HDFC", "AXIS", "ICICI", "SBI CARD", "AMEX", "IDFC FIRST"];

export function LogoMarquee() {
  return <section aria-label="Issuers compared" className="border-y border-border bg-surface-1 py-7"><Container><Marquee><div className="flex items-center gap-16">{issuers.map((issuer) => <span key={issuer} className="text-sm font-black tracking-[.18em] text-muted/60 transition hover:text-teal-400">{issuer}</span>)}</div></Marquee></Container></section>;
}
