import { useMemo, useState } from "react";
import MapPicker from "@/components/MapPicker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { insertTransaction } from "@/lib/transactions";

type Selection = {
  country?: string;
  currency?: string;
  lat?: number;
  lng?: number;
};

const GeoExpense = () => {
  const [sel, setSel] = useState<Selection>({});
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const [showMap, setShowMap] = useState(false);

  const summary = useMemo(() => {
    const parts = [] as string[];
    if (sel.country) parts.push(`Country: ${sel.country}`);
    if (sel.currency) parts.push(`Currency: ${sel.currency}`);
    if (sel.lat && sel.lng) parts.push(`Lat/Lng: ${sel.lat.toFixed(4)}, ${sel.lng.toFixed(4)}`);
    return parts.join(" • ");
  }, [sel]);

  const handleAdd = async () => {
    if (!sel.currency) {
      toast({ title: "Missing currency", description: "Select a location on the map first." });
      return;
    }
    const amt = Number(amount);
    if (!isFinite(amt) || amt <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid amount greater than 0." });
      return;
    }
    try {
      const row = await insertTransaction({
        type: "expense",
        amount_original: amt,
        currency_original: sel.currency,
        occurred_at: new Date().toISOString(),
        lat: sel.lat,
        lng: sel.lng,
      });
      toast({ title: "Expense saved", description: `#${row.id} • ${amt} ${sel.currency}` });
      setAmount("");
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "destructive" as any });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 grid place-items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Global Expense Picker</CardTitle>
          <CardDescription>
            Click anywhere on the map to detect country and currency, then enter an expense amount.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {sel.country || sel.currency
                ? `Selected: ${sel.country ?? "Unknown country"} • ${sel.currency ?? "?"}`
                : "No location selected yet."}
            </div>
            <Button type="button" variant="outline" onClick={() => setShowMap((v) => !v)}>
              {showMap ? "Hide Map" : "Choose Location on Map"}
            </Button>
          </div>
          {showMap && (
            <MapPicker
              onLocationSelected={({ latlng, currency, country }) => {
                setSel({ country, currency, lat: latlng.lat, lng: latlng.lng });
                setShowMap(false);
              }}
            />
          )}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">{summary || "No location selected yet."}</div>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="max-w-xs"
              />
              <div className="text-sm">{sel.currency ? sel.currency : "Currency unknown"}</div>
              <Button type="button" disabled={!amount || !sel.currency} onClick={handleAdd}>Add Expense</Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Integrate with your transactions form to store original currency and converted base currency.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeoExpense;


