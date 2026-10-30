"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Axe,
  Bell,
  BookOpen,
  BookmarkCheck,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  Coins,
  Cross,
  Crosshair,
  Dices,
  Facebook,
  Flame,
  Gem,
  Gift,
  Globe,
  HeartPulse,
  Hourglass,
  Flag,
  Lightbulb,
  MessagesSquare,
  Package,
  Repeat,
  Rocket,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Star,
  Sunrise,
  Target,
  Timer,
  TrendingUp,
  UsersRound,
  Wind,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ragnarokgo.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Ragnarok: GO Wiki",
        description:
          "Complete Ragnarok: GO Wiki covering codes, classes, pets, skills, dungeons, bosses, gear, and updates for Gravity's pixel-art idle RPG mobile game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1280,
          height: 720,
          caption: "Ragnarok: GO - Pixel-Art Idle RPG Mobile Game",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Ragnarok: GO Wiki",
        alternateName: "Ragnarok: GO",
        url: siteUrl,
        description:
          "Complete Ragnarok: GO Wiki resource hub for codes, classes, pets, skills, dungeons, bosses, and beginner guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1280,
          height: 720,
          caption: "Ragnarok: GO Wiki - Pixel-Art Idle RPG Mobile Game",
        },
        sameAs: [
          "https://www.facebook.com/people/Ragnarok-GO/61590430986466/",
          "https://www.reddit.com/r/RagnarokOnline/",
          "https://www.gravity.co.kr/en/pr/media",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Ragnarok: GO",
        gamePlatform: ["iOS", "Android"],
        applicationCategory: "Game",
        genre: ["Idle RPG", "Pixel Art", "Role-Playing", "Adventure"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://apps.apple.com/ph/app/ragnarok-go/id6805760478",
        },
      },
      {
        "@type": "VideoObject",
        name: "Ragnarok Go SEA Gameplay Android / iOS (Official Launch)",
        description:
          "Ragnarok: GO official launch SEA gameplay video featuring pixel-art idle RPG auto-battle, pets, and class change systems on Android and iOS.",
        uploadDate: "2026-10-29",
        thumbnailUrl: "https://i.ytimg.com/vi/gMHrn-6Wfl4/hqdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/gMHrn-6Wfl4",
        url: "https://www.youtube.com/watch?v=gMHrn-6Wfl4",
      },
    ],
  };

  // FAQ accordion states
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tier badge styles (全局主题色变量，S 金 / A 主题青 / B 中性)
  const tierBadgeStyles: Record<string, string> = {
    S: "bg-[hsl(var(--nav-gold)/0.15)] border-[hsl(var(--nav-gold)/0.4)] text-[hsl(var(--nav-gold))]",
    A: "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]",
    B: "bg-white/5 border-border text-muted-foreground",
  };
  // Tier role 图标（每个 tier 不同）
  const tierRoleIcons = [Crosshair, Shield, HeartPulse, Zap];
  // Classes 图标（每个职业不同）
  const classIcons = [Axe, Target, Flame, Cross, Wind, Coins];
  // Equipment 场景图标（每个场景不同）
  const setupIcons = [ScrollText, Skull, UsersRound, Hourglass];
  // Events 图标（每个活动不同）
  const eventIcons = [CalendarCheck, Rocket, Timer, Star, Repeat];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </aside> */}

      {/* 右侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://apps.apple.com/ph/app/ragnarok-go/id6805760478"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="gMHrn-6Wfl4"
              title="Ragnarok Go SEA Gameplay Android / iOS (Official Launch)"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（紧接视频区，锚点对应下方全部模块） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID（与下方 8 个模块一一对应）
              const sectionIds = [
                "codes",
                "beginner-guide",
                "tier-list",
                "reroll-guide",
                "classes-and-jobs",
                "progression-guide",
                "equipment-and-pets",
                "events-and-rewards",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section - 紧接 Tools Grid 之下 */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Ragnarok GO Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoCodes"]}
                locale={locale}
              >
                {t.modules.ragnarokGoCodes.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoCodes.intro}
            </p>
          </div>

          {/* Code source cards */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-10">
            {t.modules.ragnarokGoCodes.sources.map(
              (source: any, index: number) => {
                const sourceIcons = [Globe, Facebook, MessagesSquare];
                const SourceIcon = sourceIcons[index % sourceIcons.length];
                return (
                  <div
                    key={index}
                    className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        <SourceIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <h3 className="font-bold text-sm md:text-base leading-snug">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `ragnarokGoCodes::sources::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {source.label}
                        </LinkedTitle>
                      </h3>
                    </div>
                    <span className="inline-flex self-start items-center gap-1.5 mb-3 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-gold)/0.12)] border border-[hsl(var(--nav-gold)/0.35)] text-[hsl(var(--nav-gold))]">
                      <Gift className="w-3 h-3" />
                      {source.channel}
                    </span>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground">
                        Status:
                      </span>{" "}
                      {source.status}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground">
                        Rewards:
                      </span>{" "}
                      {source.reward}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      <span className="font-semibold text-foreground">
                        Expiry:
                      </span>{" "}
                      {source.expiry}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                      {source.howToRedeem}
                    </p>
                  </div>
                );
              },
            )}
          </div>

          {/* Redemption tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">
                Redemption Tips
              </h3>
            </div>
            <ul className="space-y-2">
              {t.modules.ragnarokGoCodes.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Ragnarok GO Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoBeginnerGuide"]}
                locale={locale}
              >
                {t.modules.ragnarokGoBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.ragnarokGoBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5 md:mb-2">
                      <h3 className="text-lg md:text-xl font-bold">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `ragnarokGoBeginnerGuide::steps::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {step.title}
                        </LinkedTitle>
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-accent)/0.12)] border border-[hsl(var(--nav-accent)/0.35)] text-[hsl(var(--nav-accent))]">
                        {step.priority}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Common mistake:
                      </span>{" "}
                      {step.mistake}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.ragnarokGoBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 3: Ragnarok GO Tier List */}
      <section id="tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoTierList"]}
                locale={locale}
              >
                {t.modules.ragnarokGoTierList.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoTierList.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.ragnarokGoTierList.tiers.map(
              (tier: any, index: number) => {
                const RoleIcon = tierRoleIcons[index % tierRoleIcons.length];
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border text-xl font-bold ${tierBadgeStyles[tier.tier] || tierBadgeStyles.B}`}
                      >
                        {tier.tier}
                      </span>
                      <div>
                        <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                          <RoleIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `ragnarokGoTierList::tiers::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {tier.role}
                          </LinkedTitle>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tier.examples}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tier.bestFor.map((scene: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                        >
                          {scene}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {tier.evaluation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Investment:
                      </span>{" "}
                      {tier.investmentNote}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Ragnarok GO Reroll Guide */}
      <section
        id="reroll-guide"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoRerollGuide"]}
                locale={locale}
              >
                {t.modules.ragnarokGoRerollGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoRerollGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.ragnarokGoRerollGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-accent)/0.4)] bg-[hsl(var(--nav-accent)/0.15)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-accent))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `ragnarokGoRerollGuide::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <Dices className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Decision:
                          </span>{" "}
                          {step.decision}
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-gold)/0.08)] border border-[hsl(var(--nav-gold)/0.3)]">
                        <BookmarkCheck className="w-4 h-4 text-[hsl(var(--nav-gold))] mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Keep when:
                          </span>{" "}
                          {step.keepCondition}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 移动端横幅广告（原广告位 6） */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Ragnarok GO Classes and Jobs */}
      <section id="classes-and-jobs" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoClassesAndJobs"]}
                locale={locale}
              >
                {t.modules.ragnarokGoClassesAndJobs.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoClassesAndJobs.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.ragnarokGoClassesAndJobs.classes.map(
              (cls: any, index: number) => {
                const ClassIcon = classIcons[index % classIcons.length];
                return (
                  <div
                    key={index}
                    className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        <ClassIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base md:text-lg leading-tight">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `ragnarokGoClassesAndJobs::classes::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {cls.name}
                          </LinkedTitle>
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {cls.jobRoute}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex self-start items-center mb-3 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {cls.role}
                    </span>
                    <p className="text-xs text-muted-foreground mb-3">
                      <span className="font-semibold text-foreground">
                        Focus:
                      </span>{" "}
                      {cls.coreFocus}
                    </p>
                    <ul className="space-y-1.5 mb-3">
                      {cls.strengths.map((s: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {cls.scenes.map((scene: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                        >
                          {scene}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-3 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Idle:
                        </span>{" "}
                        {cls.idleRating}
                      </span>
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Party:
                        </span>{" "}
                        {cls.partyValue}
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Ragnarok GO Progression Guide */}
      <section
        id="progression-guide"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoProgressionGuide"]}
                locale={locale}
              >
                {t.modules.ragnarokGoProgressionGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoProgressionGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.ragnarokGoProgressionGuide.steps.map(
              (step: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-accent)/0.12)] border border-[hsl(var(--nav-accent)/0.35)] text-[hsl(var(--nav-accent))]">
                        {step.phase}
                      </span>
                      <h3 className="font-bold text-base md:text-lg">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `ragnarokGoProgressionGuide::steps::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {step.title}
                        </LinkedTitle>
                      </h3>
                    </div>
                    <ul className="space-y-1.5 mb-3">
                      {step.objectives.map((obj: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mb-1.5 flex items-start gap-2">
                      <Flag className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-semibold text-foreground">
                          Priority:
                        </span>{" "}
                        {step.priority}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <Sunrise className="w-3.5 h-3.5 text-[hsl(var(--nav-gold))] mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-semibold text-foreground">
                          Daily routine:
                        </span>{" "}
                        {step.dailyRoutine}
                      </span>
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Ragnarok GO Equipment and Pets */}
      <section id="equipment-and-pets" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoEquipmentAndPets"]}
                locale={locale}
              >
                {t.modules.ragnarokGoEquipmentAndPets.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoEquipmentAndPets.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.ragnarokGoEquipmentAndPets.setups.map(
              (setup: any, index: number) => {
                const SetupIcon = setupIcons[index % setupIcons.length];
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                        <SetupIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <h3 className="font-bold text-base md:text-lg">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `ragnarokGoEquipmentAndPets::setups::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {setup.title}
                        </LinkedTitle>
                      </h3>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Recommended setup
                    </p>
                    <ul className="space-y-1.5 mb-4">
                      {setup.setup.map((item: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Upgrade priority
                    </p>
                    <ol className="space-y-1.5 mb-4">
                      {setup.upgradePriority.map(
                        (item: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.15)] text-[0.65rem] font-bold text-[hsl(var(--nav-theme-light))]">
                              {i + 1}
                            </span>
                            {item}
                          </li>
                        ),
                      )}
                    </ol>
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <Gem className="w-3.5 h-3.5 text-[hsl(var(--nav-gold))] mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-semibold text-foreground">
                          Materials:
                        </span>{" "}
                        {setup.materialFocus}
                      </span>
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Ragnarok GO Events and Rewards */}
      <section
        id="events-and-rewards"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["ragnarokGoEventsAndRewards"]}
                locale={locale}
              >
                {t.modules.ragnarokGoEventsAndRewards.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.ragnarokGoEventsAndRewards.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.ragnarokGoEventsAndRewards.events.map(
              (event: any, index: number) => {
                const EventIcon = eventIcons[index % eventIcons.length];
                const isHigh = event.priority === "High";
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                          <EventIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                        </div>
                        <h3 className="font-bold text-base md:text-lg leading-snug">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `ragnarokGoEventsAndRewards::events::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {event.title}
                          </LinkedTitle>
                        </h3>
                      </div>
                      <span
                        className={`flex-shrink-0 text-xs px-2 py-1 rounded-full border ${isHigh ? "bg-[hsl(var(--nav-accent)/0.12)] border-[hsl(var(--nav-accent)/0.35)] text-[hsl(var(--nav-accent))]" : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]"}`}
                      >
                        {event.priority}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {event.time}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Conditions
                        </p>
                        <ul className="space-y-1.5">
                          {event.conditions.map((c: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Rewards
                        </p>
                        <ul className="space-y-1.5">
                          {event.rewards.map((r: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <Package className="w-3.5 h-3.5 text-[hsl(var(--nav-gold))] mt-0.5 flex-shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <Bell className="w-3.5 h-3.5 text-[hsl(var(--nav-gold))] mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-semibold text-foreground">
                          Reminder:
                        </span>{" "}
                        {event.reminder}
                      </span>
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.facebook.com/people/Ragnarok-GO/61590430986466/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.facebook}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/RagnarokOnline/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gravity.co.kr/en/pr/media"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.officialInfo}
                  </a>
                </li>
                <li>
                  <a
                    href="https://apps.apple.com/ph/app/ragnarok-go/id6805760478"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.appStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
