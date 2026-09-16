import type { Profile, ScoredCard } from "@/src/lib/types";
import { Container } from "@/src/components/layout/Container";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { Badge } from "@/src/components/ui/Badge";
import { CompareTray } from "@/src/components/compare/CompareTray";

export type ResultsSectionProps = { matches: ScoredCard[]; profile: Profile | null };

export function ResultsSection({ matches, profile }: ResultsSectionProps) {
  if (!matches.length) return null;
  const chips = profile ? [profile.travelType, profile.loungeNeed, ...profile.priorities.slice(0, 2)].filter(Boolean) : [];
  return <section id="results" className="py-20 md:py-28"><Container><SectionHeading eyebrow="Your shortlist" title="Three cards worth a closer look." description="These matches balance the priorities you gave us with the data we could verify." />{chips.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{chips.map((chip) => <Badge key={chip} tone="teal">{chip}</Badge>)}</div>}<div className="mt-10"><CompareTray items={matches} /></div></Container></section>;
}
