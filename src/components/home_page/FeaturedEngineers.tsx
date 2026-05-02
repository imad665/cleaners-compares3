import { ArrowRight, Wrench } from "lucide-react";
/* import engineerLaundry from "@/assets/engineer-laundry.jpg";
import engineerFinishing from "@/assets/engineer-finishing.jpg";
import engineerDryCleaning from "@/assets/engineer-dry-cleaning.jpg";
 */
type FeaturedEngineer = {
  name: string;
  specialty: string;
  location: string;
  image: string;
  slug: string;
};

const engineers: FeaturedEngineer[] = [
  {
    name: "ProLaundry Engineering Co.",
    specialty: "Laundry Machine Servicing",
    location: "London, UK",
    image: '/assets/engineer-laundry.jpg',
    slug: "laundry",
  },
  {
    name: "FinishPro Technicians",
    specialty: "Finishing Equipment Experts",
    location: "Manchester, UK",
    image: '/assets/engineer-finishing.jpg',
    slug: "finishing",
  },
  {
    name: "DryClean Solutions Ltd.",
    specialty: "Dry Cleaning Specialists",
    location: "Birmingham, UK",
    image: '/assets/engineer-dry-cleaning.jpg',
    slug: "dry-cleaning",
  },
];

export function FeaturedEngineers() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Featured Engineers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Trusted engineers and service providers ready to keep your equipment running.
          </p>
        </div>
        <a href="/engineers" className="text-sm font-semibold text-primary inline-flex items-center gap-1 whitespace-nowrap">
          View All Engineers <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {engineers.map((e) => (
          <a
            key={e.slug}
            href={`/engineers/${e.slug}`}
            className="group rounded-xl border bg-card overflow-hidden hover:shadow-md hover:border-primary transition-all flex flex-col"
          >
            <div className="aspect-[16/10] overflow-hidden bg-secondary/40">
              <img
                src={e.image}
                alt={e.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary uppercase tracking-wide mb-2">
                <Wrench className="h-3.5 w-3.5" /> {e.specialty}
              </div>
              <h3 className="font-semibold text-base">{e.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{e.location}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                View profile <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
