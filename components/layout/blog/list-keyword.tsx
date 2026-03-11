import { Link } from "@/src/i18n/navigation";

const BLOG_TOPICS = [
  { label: "E-Roller", query: "e-roller" },
  { label: "Seniorenmobil", query: "seniorenmobil" },
  { label: "Akku Pflege", query: "akku" },
  { label: "Reichweite", query: "reichweite" },
  { label: "Straßenzulassung", query: "strassenzulassung" },
  { label: "Wartung", query: "wartung" },
  { label: "Sicherheit", query: "sicherheit" },
  { label: "Zubehoer", query: "zubehoer" },
];

export default function BlogListKeywords() {
  return (
    <div className="border rounded-2xl shadow-xl px-4 py-4">
      <h4 className="text-lg text-primary">Beliebte Themen</h4>
      <div className="flex gap-2 flex-wrap mt-2">
        {BLOG_TOPICS.map((topic) => (
          <Link
            key={topic.query}
            href={`/alle-produkte?search=${encodeURIComponent(topic.query)}`}
            className="text-sm border rounded-xl px-2 hover:text-primary hover:border-primary transition-all duration-200"
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
