import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Filters } from "@/lib/filtering";
import { FilterPanel } from "./FilterPanel";
import { Button } from "@/components/ui/Button";

/** Bottom-sheet filter drawer for mobile. */
export function FilterDrawer({
  open,
  onClose,
  filters,
  setFilters,
  onClear,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClear: () => void;
  resultCount: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/70 lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl border-t border-line bg-surface p-4 thin-scrollbar"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display font-bold">Filters</h3>
              <button onClick={onClose} aria-label="Close filters">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>
            <FilterPanel
              value={filters}
              onChange={setFilters}
              onClear={onClear}
              resultCount={resultCount}
            />
            <Button className="mt-4 w-full" onClick={onClose}>
              Show {resultCount} results
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
