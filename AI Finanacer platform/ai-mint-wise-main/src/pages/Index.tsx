import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, PieChart, Target, Plus, ReceiptText, CalendarDays, Mic, StopCircle } from "lucide-react";
import { format } from "date-fns";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart as RePieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";

type ExpenseFormValues = {
  title: string;
  amount: number | string;
  category: string;
  notes?: string;
};

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  createdAt: string;
};

const Index = () => {
  const { toast } = useToast();

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [userEmail] = useState<string | null>(null);
  // Goal-based saving state (basic single goal)
  const [goalTarget, setGoalTarget] = useState<number>(500);
  const [goalSaved, setGoalSaved] = useState<number>(0);
  const [goalDue, setGoalDue] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().slice(0, 10));
  // Optional monthly budget for projections
  const [monthlyBudget, setMonthlyBudget] = useState<number>(1500);

  const form = useForm<ExpenseFormValues>({
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      notes: "",
    },
    mode: "onChange",
  });

  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const [pulseTotal, setPulseTotal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (expenses.length === 0) return;
    setPulseTotal(true);
    const t = setTimeout(() => setPulseTotal(false), 850);
    return () => clearTimeout(t);
  }, [total]);

  // Load expenses from REST API (MongoDB)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) return;
        const items = await res.json();
        setExpenses(
          items.map((r: any) => ({
            id: (r.id || r._id)?.toString?.() ?? crypto.randomUUID(),
            title: r.title ?? r.note ?? "Expense",
            amount: Number(r.amount_original ?? r.amount ?? 0),
            category: r.category ?? "Uncategorized",
            notes: r.note ?? undefined,
            createdAt: (r.created_at || r.occurred_at || new Date()).toString(),
          }))
        );
      } catch {
        // ignore
      }
    })();
  }, []);

  const onSubmit = (values: ExpenseFormValues) => {
    const parsedAmount = typeof values.amount === "string" ? parseFloat(values.amount) : values.amount;
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a positive number.", variant: "destructive" as any });
      return;
    }
    if (!values.title.trim()) {
      toast({ title: "Title required", description: "Please add a brief title.", variant: "destructive" as any });
      return;
    }
    const newItem: ExpenseItem = {
      id: crypto.randomUUID(),
      title: values.title.trim(),
      amount: parsedAmount,
      category: values.category.trim() || "Uncategorized",
      notes: values.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newItem, ...prev]);
    form.reset();
    toast({ title: "Expense added", description: `${newItem.title} - $${newItem.amount.toFixed(2)}` });
    setOpenDialog(false);
    // Persist to Supabase
    (async () => {
      if (!isSupabaseEnabled()) return;
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) return;
      await supabase!.from("expenses").insert({ id: newItem.id, title: newItem.title, amount: newItem.amount, category: newItem.category, notes: newItem.notes ?? null, created_at: newItem.createdAt });
    })();
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);

  const startOfThisMonth = new Date();
  startOfThisMonth.setDate(1);
  startOfThisMonth.setHours(0, 0, 0, 0);

  const thisMonthTotal = expenses
    .filter((e) => new Date(e.createdAt).getTime() >= startOfThisMonth.getTime())
    .reduce((sum, e) => sum + e.amount, 0);

  const categoriesCount = Array.from(new Set(expenses.map((e) => (e.category || "Uncategorized").toLowerCase()))).length;
  const activeBudgets = 1; // placeholder

  // Analytics datasets
  const last30 = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    const days: { date: string; total: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const total = expenses
        .filter((e) => e.createdAt.slice(0, 10) === key)
        .reduce((s, e) => s + e.amount, 0);
      days.push({ date: key, total });
    }
    return days;
  }, [expenses]);

  const averageDaily30 = useMemo(() => last30.reduce((s, d) => s + d.total, 0) / 30, [last30]);

  // Predictive budgeting: project month-end spending based on current daily average this month
  const predictive = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());
    const avgDailyThisMonth = thisMonthTotal / daysElapsed;
    const projected = avgDailyThisMonth * daysInMonth;
    // last month total
    const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLast = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthTotal = expenses
      .filter((e) => {
        const t = new Date(e.createdAt).getTime();
        return t >= startLast.getTime() && t < endLast.getTime();
      })
      .reduce((s, e) => s + e.amount, 0);
    const deltaPct = lastMonthTotal > 0 ? ((projected - lastMonthTotal) / lastMonthTotal) * 100 : 0;
    const expectedRemaining = monthlyBudget - projected;
    return { projected, lastMonthTotal, deltaPct, expectedRemaining };
  }, [expenses, thisMonthTotal, monthlyBudget]);

  // AI-like category suggestion from title keywords (local heuristic)
  const categorySuggestion = useMemo(() => {
    const title = (form.getValues("title") || "").toLowerCase();
    const rules: Array<[RegExp, string]> = [
      [/pizza|burger|food|restaurant|dinner|lunch|grocer|coffee/, "Food & Dining"],
      [/uber|taxi|metro|bus|train|fuel|gas|petrol/, "Transport"],
      [/rent|mortgage|lease/, "Housing"],
      [/netflix|spotify|subscription|prime|subscr/, "Subscriptions"],
      [/gym|fitness|yoga/, "Health & Fitness"],
      [/movie|game|concert|entertain/, "Entertainment"],
      [/electric|water|internet|utility|bill/, "Utilities"],
      [/flight|hotel|travel|trip/, "Travel"],
    ];
    for (const [re, cat] of rules) if (re.test(title)) return cat;
    return "Uncategorized";
  }, [form.watch("title")]);

  const categoryOptions = useMemo(
    () => [
      "Food & Dining",
      "Transport",
      "Housing",
      "Subscriptions",
      "Health & Fitness",
      "Entertainment",
      "Utilities",
      "Travel",
      "Education",
      "Shopping",
      "Uncategorized",
    ],
    [],
  );

  // Voice quick-add using Web Speech API (best-effort parsing)
  const startVoice = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Voice unsupported", description: "SpeechRecognition not available in this browser.", variant: "destructive" as any });
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript.toLowerCase();
      // Simple patterns: "add 20 for groceries" or "20 dollars groceries"
      const amountMatch = text.match(/(\d+[\.,]?\d*)/);
      const title = text.replace(/add|rupees|dollars|dollar|for|today|tomorrow|yesterday|\d+[\.,]?\d*/g, " ").trim();
      if (amountMatch) form.setValue("amount", amountMatch[1].replace(",", "."));
      if (title) form.setValue("title", title);
      // Apply category suggestion if available
      if (categorySuggestion) form.setValue("category", categorySuggestion);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      const key = (e.category || "Uncategorized").trim() || "Uncategorized";
      map.set(key, (map.get(key) || 0) + e.amount);
    }
    const entries = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    entries.sort((a, b) => b.value - a.value);
    return entries;
  }, [expenses]);

  const last12Months = useMemo(() => {
    const now = new Date();
    const months: { label: string; total: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = format(d, "MMM yy");
      const start = new Date(d);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const total = expenses
        .filter((e) => {
          const t = new Date(e.createdAt).getTime();
          return t >= start.getTime() && t < end.getTime();
        })
        .reduce((s, e) => s + e.amount, 0);
      months.push({ label, total });
    }
    return months;
  }, [expenses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100/70 p-6 md:p-8 animate-fade-in">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="glass rounded-xl p-5 md:p-6 flex items-center justify-between shadow-sm animate-slide-up">
          <div>
            <div className="text-sm text-muted-foreground">Welcome back, <span className="font-medium">{userEmail ?? "Guest"}</span></div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1 text-gradient">Finance Manager</h1>
          </div>
          <div className="hidden md:flex gap-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Total Expenses</CardDescription>
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 grid place-items-center"><DollarSign className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(total)}</div>
              <p className="text-xs text-muted-foreground">All-time expenses</p>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>This Month</CardDescription>
              <div className="h-9 w-9 rounded-xl bg-green-500/10 text-green-600 grid place-items-center"><TrendingUp className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(thisMonthTotal)}</div>
              <p className="text-xs text-muted-foreground">Current month spending</p>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Categories</CardDescription>
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 grid place-items-center"><PieChart className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoriesCount}</div>
              <p className="text-xs text-muted-foreground">Expense categories</p>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Active Budgets</CardDescription>
              <div className="h-9 w-9 rounded-xl bg-orange-500/10 text-orange-600 grid place-items-center"><Target className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBudgets}</div>
              <p className="text-xs text-muted-foreground">Budget tracking</p>
            </CardContent>
          </Card>
          <Card className="glass hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Predicted Month-End</CardDescription>
              <div className="h-9 w-9 rounded-xl bg-sky-500/10 text-sky-600 grid place-items-center"><TrendingUp className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold">{formatCurrency(predictive.projected || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Expected Remaining: <span className={predictive.expectedRemaining < 0 ? "text-destructive" : ""}>{formatCurrency(predictive.expectedRemaining || 0)}</span>
              </p>
            </CardContent>
          </Card>
          </div>
          
        <Tabs defaultValue="expenses" className="glass rounded-xl p-1 md:p-2">
          <div className="px-3 md:px-4 py-2">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">$ Expenses</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
            </TabsList>
          </div>
          <Separator />

          <TabsContent value="expenses" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center"><ReceiptText className="h-5 w-5" /></div>
                <h2 className="text-xl md:text-2xl font-semibold">Expense Tracker</h2>
              </div>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-600/90"><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[560px]">
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>Track and manage your daily expenses with smart categorization.</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Groceries" {...field} />
                            </FormControl>
                            {form.watch("title") && (
                              <p className="text-xs text-muted-foreground">Suggested category: <span className="font-medium">{categorySuggestion}</span></p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="e.g. 54.90" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Category</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={categorySuggestion ? `Suggested: ${categorySuggestion}` : "Select a category"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categoryOptions.map((opt) => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Optional notes..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-2 flex justify-between gap-2">
                        <Button type="button" variant={listening ? "destructive" : "outline"} onClick={listening ? undefined : startVoice} title="Voice quick add">
                          {listening ? <StopCircle className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />} {listening ? "Listening..." : "Voice Input"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button type="submit" className="transition-transform active:scale-[0.98]">Add Expense</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
          </div>
          
            {expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses yet. Add your first expense using the button above.</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((e) => (
                  <div key={e.id} className="rounded-xl border bg-card/70 glass px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 grid place-items-center">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{e.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="px-2 py-0.5">{e.category || "Uncategorized"}</Badge>
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{format(new Date(e.createdAt), "dd/MM/yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-semibold">{formatCurrency(e.amount)}</div>
                  </div>
                ))}
          </div>
            )}
          </TabsContent>

          <TabsContent value="budgets" className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Savings Goal</CardTitle>
                  <CardDescription>Set a goal and track your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Target Amount</label>
                      <Input type="number" value={goalTarget} onChange={(e) => setGoalTarget(parseFloat(e.target.value || "0"))} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Saved So Far</label>
                      <Input type="number" value={goalSaved} onChange={(e) => setGoalSaved(parseFloat(e.target.value || "0"))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-muted-foreground">Goal Due Date</label>
                      <Input type="date" value={goalDue} onChange={(e) => setGoalDue(e.target.value)} />
                    </div>
                  </div>
                  {(() => {
                    const remaining = Math.max(0, goalTarget - goalSaved);
                    const pct = Math.min(100, (goalSaved / Math.max(1, goalTarget)) * 100);
                    const daysLeft = Math.max(1, Math.ceil((new Date(goalDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                    const perDay = remaining / daysLeft;
                    const perWeek = perDay * 7;
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs"><span>Progress</span><span>{pct.toFixed(0)}%</span></div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-blue-600" style={{ width: `${pct}%` }} /></div>
                        <p className="text-xs text-muted-foreground">Save {formatCurrency(perDay)} per day ({formatCurrency(perWeek)} / week) to reach {format(new Date(goalDue), "dd MMM yyyy")}.</p>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Budget</CardTitle>
                  <CardDescription>Set a budget for projections and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Budget Amount</label>
                    <Input type="number" value={monthlyBudget} onChange={(e) => setMonthlyBudget(parseFloat(e.target.value || "0"))} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span>Projected Spend</span><span>{formatCurrency(predictive.projected || 0)}</span></div>
                    {(() => {
                      const pct = Math.min(100, Math.max(0, (predictive.projected / Math.max(1, monthlyBudget)) * 100));
                      return <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} /></div>;
                    })()}
                    <p className="text-xs text-muted-foreground">Expected Remaining at month end: {formatCurrency(predictive.expectedRemaining || 0)}</p>
                    <p className="text-xs">{`Based on your current trend, you might spend ${formatCurrency(predictive.projected || 0)} this month — ${predictive.deltaPct.toFixed(0)}% ${predictive.deltaPct >= 0 ? "higher" : "lower"} than last month.`}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="glass">
                <CardHeader className="pb-2">
                  <CardDescription>Total Expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(total)}</div>
                  <p className="text-xs text-muted-foreground">For The Selected Month</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader className="pb-2">
                  <CardDescription>Categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{byCategory.length}</div>
                  <p className="text-xs text-muted-foreground">categories with expenses</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader className="pb-2">
                  <CardDescription>Average Daily</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(averageDaily30 || 0)}</div>
                  <p className="text-xs text-muted-foreground">over last 30 days</p>
                </CardContent>
              </Card>
          </div>
          
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Expenses by Category</CardTitle>
                  <CardDescription>Breakdown of spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{ value: { label: "Amount" } }}
                    className="h-[260px] aspect-auto"
                  >
                    <RePieChart>
                      <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                        {byCategory.map((_, idx) => (
                          <Cell key={idx} fill={`hsl(${(idx * 47) % 360} 70% 50%)`} />
                        ))}
                      </Pie>
                      <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RePieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Category Breakdown</CardTitle>
                  <CardDescription>Spending amounts by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ total: { label: "Amount" } }} className="h-[260px] aspect-auto">
                    <BarChart data={byCategory}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {byCategory.map((_, idx) => (
                          <Cell key={idx} fill={`hsl(${(idx * 47) % 360} 70% 50%)`} />
                        ))}
                      </Bar>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Trends</CardTitle>
                  <CardDescription>Spending trends over the last 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ total: { label: "Total" } }} className="h-[260px] aspect-auto">
                    <LineChart data={last12Months}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Line dataKey="total" stroke="hsl(220 70% 50%)" strokeWidth={2} dot={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Spending</CardTitle>
                  <CardDescription>Daily expenses over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ total: { label: "Total" } }} className="h-[260px] aspect-auto">
                    <BarChart data={last30}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} hide />
                      <YAxis tickLine={false} axisLine={false} />
                      <Bar dataKey="total" fill="hsl(150 60% 45%)" radius={[6, 6, 0, 0]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="glass lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Spending Heatmap</CardTitle>
                  <CardDescription>Calendar highlighting days with higher spend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {(() => {
                      const now = new Date();
                      const first = new Date(now.getFullYear(), now.getMonth(), 1);
                      const startWeekday = first.getDay();
                      const daysIn = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                      const cells: JSX.Element[] = [];
                      const totalsByDay: Record<number, number> = {};
                      expenses
                        .filter((e) => new Date(e.createdAt).getMonth() === now.getMonth() && new Date(e.createdAt).getFullYear() === now.getFullYear())
                        .forEach((e) => {
                          const d = new Date(e.createdAt).getDate();
                          totalsByDay[d] = (totalsByDay[d] || 0) + e.amount;
                        });
                      const max = Math.max(1, ...Object.values(totalsByDay));
                      for (let i = 0; i < startWeekday; i++) cells.push(<div key={`pad-${i}`} className="h-8" />);
                      for (let d = 1; d <= daysIn; d++) {
                        const val = totalsByDay[d] || 0;
                        const intensity = Math.ceil((val / max) * 4); // 0..4
                        const bg = ["bg-muted/40", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-500"][intensity];
                        cells.push(
                          <div key={d} className={`h-8 rounded ${bg} grid place-items-center`} title={`${formatCurrency(val)}`}>
                            {d}
                          </div>,
                        );
                      }
                      return cells;
                    })()}
          </div>
                </CardContent>
              </Card>
        </div>
          </TabsContent>
          <TabsContent value="ai" className="p-4">
            <Button onClick={() => toast({ title: "AI Insights", description: "This would call your AI service for personalized tips." })}>Generate Insights</Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
