import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Droplets, Moon, Heart, Weight, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { getHealthRecommendations, calculateBMI, getHealthScore } from "@/lib/healthAI";

interface HealthLog {
  id: string;
  logged_at: string;
  weight_kg: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  blood_sugar: number | null;
  heart_rate: number | null;
  sleep_hours: number | null;
  water_intake_liters: number | null;
  exercise_minutes: number | null;
}

interface Profile {
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  gender: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [logsRes, profileRes] = await Promise.all([
        supabase
          .from("health_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("logged_at", { ascending: true })
          .limit(30),
        supabase.from("profiles").select("height_cm, weight_kg, age, gender").eq("user_id", user.id).single(),
      ]);
      if (logsRes.data) setLogs(logsRes.data as HealthLog[]);
      if (profileRes.data) setProfile(profileRes.data as Profile);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const latestLog = logs[logs.length - 1];
  const bmi = calculateBMI(latestLog?.weight_kg ?? profile?.weight_kg ?? null, profile?.height_cm ?? null);
  const healthScore = getHealthScore(latestLog, bmi);
  const recommendations = getHealthRecommendations(latestLog, profile, bmi);

  const chartData = logs.map((l) => ({
    date: new Date(l.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: l.weight_kg,
    heartRate: l.heart_rate,
    sleep: l.sleep_hours,
    water: l.water_intake_liters,
    sugar: l.blood_sugar,
  }));

  const statCards = [
    { label: "BMI", value: bmi ? bmi.toFixed(1) : "—", icon: Weight, color: "text-primary" },
    { label: "Heart Rate", value: latestLog?.heart_rate ? `${latestLog.heart_rate} bpm` : "—", icon: Heart, color: "text-health-danger" },
    { label: "Sleep", value: latestLog?.sleep_hours ? `${latestLog.sleep_hours}h` : "—", icon: Moon, color: "text-health-info" },
    { label: "Water", value: latestLog?.water_intake_liters ? `${latestLog.water_intake_liters}L` : "—", icon: Droplets, color: "text-health-info" },
    { label: "Exercise", value: latestLog?.exercise_minutes ? `${latestLog.exercise_minutes} min` : "—", icon: Activity, color: "text-health-good" },
    { label: "Blood Pressure", value: latestLog?.systolic_bp ? `${latestLog.systolic_bp}/${latestLog.diastolic_bp}` : "—", icon: TrendingUp, color: "text-health-warning" },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading your health data...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Health Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your personalized wellness overview</p>
        </div>

        {/* Health Score */}
        <Card className="shadow-elevated border-border overflow-hidden">
          <div className="gradient-primary p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Health Score</p>
                <p className="text-5xl font-bold font-display mt-1">{healthScore}<span className="text-2xl opacity-70">/100</span></p>
              </div>
              <div className="h-20 w-20 rounded-full border-4 border-primary-foreground/30 flex items-center justify-center">
                <Heart className="h-8 w-8" />
              </div>
            </div>
          </div>
        </Card>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="shadow-card border-border">
              <CardContent className="p-4">
                <Icon className={`h-5 w-5 ${color} mb-2`} />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold font-display text-foreground">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        {chartData.length > 1 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Weight Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(168, 60%, 38%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(168, 60%, 38%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 18%, 88%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <Tooltip />
                    <Area type="monotone" dataKey="weight" stroke="hsl(168, 60%, 38%)" fill="url(#weightGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Heart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 18%, 88%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <Tooltip />
                    <Line type="monotone" dataKey="heartRate" stroke="hsl(0, 72%, 55%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Sleep Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 18%, 88%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <Tooltip />
                    <Area type="monotone" dataKey="sleep" stroke="hsl(200, 80%, 50%)" fill="url(#sleepGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Blood Sugar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 18%, 88%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 45%)" />
                    <Tooltip />
                    <Line type="monotone" dataKey="sugar" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Recommendations */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              AI Health Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <ul className="space-y-3">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                      rec.type === "danger" ? "bg-health-danger" : rec.type === "warning" ? "bg-health-warning" : "bg-health-good"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">{rec.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">Log your health data to receive personalized recommendations.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
