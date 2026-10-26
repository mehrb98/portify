import type { Metadata } from "next";
import { LegalPage, Ph } from "@/components/site/LegalPage";
import { getProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  return { title: `Datenschutz · ${p.name}`, alternates: { canonical: "/datenschutz" } };
}

export default async function Datenschutz() {
  const profile = await getProfile();
  return (
    <LegalPage profile={profile} eyebrow="Legal" title="Datenschutzerklärung">
      <section>
        <h2>1. Verantwortlicher</h2>
        <p className="mt-3">
          {profile.name}, <Ph>[Straße und Hausnummer, PLZ Ort]</Ph>, Deutschland
          <br />
          E-Mail:{" "}
          <a href={`mailto:${profile.email}`} className="text-signal hover:text-signal-ink">
            {profile.email}
          </a>
        </p>
      </section>
      <section>
        <h2>2. Hosting und Server-Logfiles</h2>
        <p className="mt-3">
          <Ph>[Hosting-Anbieter, Serverstandort, Art und Speicherdauer der Logdaten, Rechtsgrundlage]</Ph>
        </p>
      </section>
      <section>
        <h2>3. Lokale Speicherung im Browser</h2>
        <p className="mt-3">
          Die Website speichert die gewählte Farbdarstellung (hell oder dunkel) im Local Storage Ihres Browsers unter dem
          Schlüssel „theme“. Diese Angabe verlässt Ihr Gerät nicht. <Ph>[Rechtliche Einordnung, vom Betreiber zu prüfen]</Ph>
        </p>
      </section>
      <section>
        <h2>4. Kontakt per E-Mail</h2>
        <p className="mt-3">
          <Ph>[Verarbeitung von Anfragen per E-Mail, Rechtsgrundlage, Speicherdauer]</Ph>
        </p>
      </section>
      <section>
        <h2>5. Ihre Rechte</h2>
        <p className="mt-3">
          <Ph>[Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerderecht bei einer Aufsichtsbehörde]</Ph>
        </p>
      </section>
      <p className="font-mono text-xs text-ink-3">
        Stand: <Ph>[MM/YYYY]</Ph>
      </p>
    </LegalPage>
  );
}
