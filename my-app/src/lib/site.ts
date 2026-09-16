export const SITE = {
  name: "JourneyCard",
  tagline: "Smart travel, better rewards.",
  description: "Find the Indian credit card that fits how you travel, spend, and earn.",
  url: "https://bestcreditcard.me",
  nav: [
    { label: "Cards", href: "#top-picks" },
    { label: "Match", href: "#card-match" },
    { label: "Why us", href: "#why-us" },
    { label: "Guides", href: "#guides" },
  ],
  socials: [
    { label: "X", href: "https://x.com/journeycard" },
    { label: "Instagram", href: "https://instagram.com/journeycard" },
    { label: "LinkedIn", href: "https://linkedin.com/company/journeycard" },
  ],
  footerColumns: [
    { title: "Explore", links: [{ label: "Compare cards", href: "#top-picks" }, { label: "Travel rewards", href: "#card-match" }, { label: "Lounge access", href: "#comparison" }, { label: "Zero forex cards", href: "#top-picks" }] },
    { title: "Resources", links: [{ label: "Card guides", href: "#guides" }, { label: "Miles calculator", href: "#card-match" }, { label: "Credit score guide", href: "#faq" }, { label: "FAQs", href: "#faq" }] },
    { title: "Company", links: [{ label: "About us", href: "#why-us" }, { label: "Contact", href: "mailto:hello@bestcreditcard.me" }, { label: "Privacy policy", href: "#privacy" }, { label: "Terms of use", href: "#terms" }] },
  ],
} as const;

export type SiteNavItem = (typeof SITE.nav)[number];
