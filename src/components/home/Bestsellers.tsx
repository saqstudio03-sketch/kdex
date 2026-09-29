import { bestsellerProducts } from "@/data/products";
import { SectionHeading } from "./SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";

/** Ranked bestseller grid — ranking shown subtly in the corner of the art. */
export function Bestsellers() {
  const list = bestsellerProducts.slice(0, 8);
  return (
    <section className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <SectionHeading
        title="Bestsellers"
        subtitle="What everyone else is buying this week."
        to="/games?sort=bestsellers"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} showRank={i + 1} />
        ))}
      </div>
    </section>
  );
}
