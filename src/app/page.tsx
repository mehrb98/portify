import type { Metadata } from "next";
import { About } from "@/components/site/About";
import { Architecture } from "@/components/site/Architecture";
import { Education } from "@/components/site/Education";
import { Experience } from "@/components/site/Experience";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Projects } from "@/components/site/Projects";
import { Reveal } from "@/components/site/Reveal";
import { SideProjects } from "@/components/site/SideProjects";
import { Stack } from "@/components/site/Stack";
import { getProfile, getSiteContent } from "@/lib/content";
import { buildTimeline } from "@/lib/site/timeline";
import { siteUrl } from "@/lib/site/url";

// Rendered per request: the content lives in the database and the admin edits it at any time.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  const title = `${p.name} · ${p.headline}`;
  return {
    title,
    description: p.pitch,
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      url: "/",
      title,
      description: p.pitch,
      siteName: p.name,
      locale: "en_US",
      images: p.photoUrl ? [{ url: p.photoUrl, width: 408, height: 408, alt: `Portrait of ${p.name}` }] : undefined,
    },
    twitter: { card: "summary", title, description: p.pitch, images: p.photoUrl ? [p.photoUrl] : undefined },
  };
}

export default async function Home() {
  const { profile, jobs, technologies, projects, education, certificates, milestones, now } = await getSiteContent();
  const on = profile.sections;
  const currentJob = jobs.find((j) => j.end === null);
  const url = siteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.headline,
    url,
    image: profile.photoUrl ? new URL(profile.photoUrl, url).toString() : undefined,
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
    worksFor: currentJob ? { "@type": "Organization", name: currentJob.company.name } : undefined,
    knowsAbout: profile.coreStack,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header profile={profile} />
      <main id="top">
        <Hero profile={profile} />
        {on.about && <About profile={profile} />}
        {on.stack && <Stack timeline={buildTimeline(jobs, technologies, education, now)} />}
        {on.experience && <Experience jobs={jobs} cvUrl={profile.cvUrl} now={now} />}
        {on.projects && <Projects projects={projects} />}
        {on.sideProjects && <SideProjects projects={projects} github={profile.github} />}
        {on.architecture && <Architecture />}
        {on.education && (
          <Education education={education} certificates={certificates} milestones={milestones} hasCurrentJob={Boolean(currentJob)} />
        )}
      </main>
      <Footer profile={profile} />
      <Reveal />
    </>
  );
}
