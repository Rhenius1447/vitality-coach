import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ClipboardPlus } from "lucide-react";

const HealthLog = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    weight_kg: "",
    systolic_bp: "",
    diastolic_bp: "",
    blood_sugar: "",
    heart_rate: "",
    sleep_hours: "",
    water_intake_liters: "",
    exercise_minutes: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const payload: Record<string, any> = { user_id: user.id };
    if (form.weight_kg) payload.weight_kg = parseFloat(form.weight_kg);
    if (form.systolic_bp) payload.systolic_bp = parseInt(form.systolic_bp);
    if (form.diastolic_bp) payload.diastolic_bp = parseInt(form.diastolic_bp);
    if (form.blood_sugar) payload.blood_sugar = parseFloat(form.blood_sugar);
    if (form.heart_rate) payload.heart_rate = parseInt(form.heart_rate);
    if (form.sleep_hours) payload.sleep_hours = parseFloat(form.sleep_hours);
    if (form.water_intake_liters) payload.water_intake_liters = parseFloat(form.water_intake_liters);
    if (form.exercise_minutes) payload.exercise_minutes = parseInt(form.exercise_minutes);
    if (form.notes) payload.notes = form.notes;

    const { error } = await supabase.from("health_logs").insert([payload] as any);
    if (error) {
      toast.error("Failed to save log: " + error.message);
    } else {
      toast.success("Health log saved!");
      setForm({
        weight_kg: "", systolic_bp: "", diastolic_bp: "", blood_sugar: "",
        heart_rate: "", sleep_hours: "", water_intake_liters: "", exercise_minutes: "", notes: "",
      });
    }
    setLoading(false);
  };

  const fields = [
    { key: "weight_kg", label: "Weight (kg)", placeholder: "72.5", type: "number", step: "0.1" },
    { key: "systolic_bp", label: "Systolic BP (mmHg)", placeholder: "120", type: "number" },
    { key: "diastolic_bp", label: "Diastolic BP (mmHg)", placeholder: "80", type: "number" },
    { key: "blood_sugar", label: "Blood Sugar (mg/dL)", placeholder: "95", type: "number" },
    { key: "heart_rate", label: "Heart Rate (bpm)", placeholder: "72", type: "number" },
    { key: "sleep_hours", label: "Sleep (hours)", placeholder: "7.5", type: "number", step: "0.5" },
    { key: "water_intake_liters", label: "Water Intake (L)", placeholder: "2.5", type: "number", step: "0.1" },
    { key: "exercise_minutes", label: "Exercise (minutes)", placeholder: "30", type: "number" },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Log Health Data</h1>
          <p className="text-muted-foreground mt-1">Record your daily health metrics</p>
        </div>

        <Card className="shadow-elevated border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <ClipboardPlus className="h-5 w-5 text-primary" />
              Today's Health Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {fields.map(({ key, label, placeholder, type, step }) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key} className="text-sm">{label}</Label>
                    <Input
                      id={key}
                      type={type}
                      step={step}
                      placeholder={placeholder}
                      value={(form as any)[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any symptoms, mood, or notes..."
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Health Log"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default HealthLog;
