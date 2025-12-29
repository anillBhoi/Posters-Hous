import { Poster } from "@/lib/types";
import { PosterCard } from "./PosterCard";

interface PosterGridProps {
  posters: Poster[];
  columns?: 2 | 3 | 4;
}

export function PosterGrid({ posters, columns = 4 }: PosterGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 lg:gap-8`}>
      {posters.map((poster, index) => (
        <PosterCard key={poster.id} poster={poster} index={index} />
      ))}
    </div>
  );
}
