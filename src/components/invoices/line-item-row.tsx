"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

interface LineItemRowProps {
  item: LineItem;
  onChange: (item: LineItem) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function LineItemRow({
  item,
  onChange,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center">
      <Input
        placeholder="Description"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
      />
      <Input
        type="number"
        min={1}
        placeholder="Qty"
        value={item.quantity}
        onChange={(e) =>
          onChange({ ...item, quantity: Number(e.target.value) })
        }
      />
      <Input
        type="number"
        min={0}
        placeholder="Rate"
        value={item.rate}
        onChange={(e) => onChange({ ...item, rate: Number(e.target.value) })}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={!canRemove}
      >
        ✕
      </Button>
    </div>
  );
}
