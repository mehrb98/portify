import type { Metadata } from "next";
import { LegalPage, Ph } from "@/components/site/LegalPage";
import { getProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  return { title: `Impressum · ${p.name}`, alternates: { canonical: "/impressum" } };
}

export default async function Impressum() {
  const profile = await getProfile();
  return (
    <LegalPage profile={profile} eyebrow="Legal" title="Impressum">
      <section>
        <h2>Angaben gemäß § 5 DDG</h2>
        <address className="mt-3 not-italic">
          {profile.name}
          <br />
          <Ph>[Straße und Hausnummer]</Ph>
          <br />
          <Ph>[PLZ] [Ort]</Ph>
          <br />
          Deutschland
        </address>
      </section>
      <section>
        <h2>Kontakt</h2>
        <p className="mt-3">
          E-Mail:{" "}
          <a href={`mailto:${profile.email}`} className="text-signal hover:text-signal-ink">
            {profile.email}
          </a>
          <br />
          Telefon: <Ph>[Telefonnummer, optional]</Ph>
        </p>
      </section>
      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p className="mt-3">
          {profile.name}, <Ph>[Anschrift wie oben]</Ph>
        </p>
      </section>
      <section>
        <h2>Haftung für Inhalte und Links</h2>
        <p className="mt-3">
          <Ph>[Haftungshinweise, vom Betreiber zu ergänzen oder zu streichen]</Ph>
        </p>
      </section>
    </LegalPage>
  );
}
