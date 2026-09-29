import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { discountPercent, formatINR } from "@/lib/utils";
import { Artwork } from "@/components/Artwork";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";

/** Full-bleed cinematic product header with breadcrumbs + key meta. */
export function DetailHero({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.salePrice);
  return (
    <div className="relative -mt-16 h-80 w-full overflow-hidden pt-16 md:-mt-[72px] md:h-[420px] md:pt-[72px]">
      <Artwork seed={product.imageSeed} variant="wide" alt="" eager className="h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 to-transparent" />

      <div className="relative mx-auto flex h-full w-full max-w-[1920px] flex-col justify-end px-4 pb-6 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <p className="mb-3 text-xs text-muted">
          <Link to="/" className="hover:text-accent">Home</Link> /{" "}
          <Link to="/games" className="hover:text-accent">Games</Link> /{" "}
          <Link to={`/platform/${product.platform.toLowerCase()}`} className="hover:text-accent">
            {product.platform}
          </Link>{" "}
          / <span className="text-white">{product.title}</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{product.platform}</Badge>
          <Badge tone="dark">{product.productType}</Badge>
          <Badge tone="dark">{product.genre}</Badge>
          {off > 0 && <Badge tone="dark">Save {off}%</Badge>}
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold md:text-5xl">{product.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Rating value={product.rating} count={product.reviewCount} size="md" />
          <span className="text-sm text-muted">
            {product.developer} • {product.publisher}
          </span>
          {off > 0 && (
            <span className="text-sm text-muted">
              <span className="line-through">{formatINR(product.price)}</span>{" "}
              <span className="font-semibold text-accent">{formatINR(product.salePrice)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
