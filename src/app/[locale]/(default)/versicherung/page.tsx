import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Versicherung | Econelo",
  description: "Platzhalterseite für Versicherungsinformationen bei Econelo.",
};

export default function VersicherungPage() {
  return (
    <div className="min-h-screen md:pt-[140px] px-4 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-border/70 bg-white p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-black">Versicherung</h1>
        <p className="mt-3 text-muted-foreground">
          Platzhalter: Inhalte für diese Seite werden später ergänzt.
        </p>
      </div>
    </div>
  );
}
