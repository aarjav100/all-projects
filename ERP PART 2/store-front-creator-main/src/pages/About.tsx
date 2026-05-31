import { useState } from 'react';
import Header from '../components/Header';
import NearbyShops from '../components/NearbyShops';
import { CartItem } from '../types/shopping';
import { ShoppingBag, Users, Award, Truck, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const About = () => {
  const [cartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: Users },
    { label: 'Products Sold', value: '50,000+', icon: ShoppingBag },
    { label: 'Years Experience', value: '5+', icon: Award },
    { label: 'Countries Served', value: '25+', icon: Truck }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Passionate about creating exceptional shopping experiences'
    },
    {
      name: 'Mike Chen',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Ensures every product meets our quality standards'
    },
    {
      name: 'Emily Davis',
      role: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Dedicated to making every customer journey perfect'
    }
  ];

  // Analytics data
  const monthlyGrowthData = [
    { month: 'Jan', customers: 1200, revenue: 45000, orders: 850 },
    { month: 'Feb', customers: 1500, revenue: 52000, orders: 1100 },
    { month: 'Mar', customers: 1800, revenue: 68000, orders: 1400 },
    { month: 'Apr', customers: 2200, revenue: 78000, orders: 1650 },
    { month: 'May', customers: 2800, revenue: 89000, orders: 1950 },
    { month: 'Jun', customers: 3200, revenue: 95000, orders: 2200 },
  ];

  const categoryPerformanceData = [
    { category: 'Electronics', sales: 35, color: '#8884d8' },
    { category: 'Furniture', sales: 28, color: '#82ca9d' },
    { category: 'Pet Supplies', sales: 22, color: '#ffc658' },
    { category: 'Sports', sales: 15, color: '#ff7c7c' },
  ];

  const customerSatisfactionData = [
    { quarter: 'Q1', satisfaction: 4.2, reviews: 450 },
    { quarter: 'Q2', satisfaction: 4.4, reviews: 620 },
    { quarter: 'Q3', satisfaction: 4.6, reviews: 780 },
    { quarter: 'Q4', satisfaction: 4.8, reviews: 950 },
  ];

  const chartConfig = {
    customers: {
      label: "Customers",
      color: "#8884d8",
    },
    revenue: {
      label: "Revenue",
      color: "#82ca9d",
    },
    orders: {
      label: "Orders",
      color: "#ffc658",
    },
    satisfaction: {
      label: "Satisfaction",
      color: "#ff7c7c",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => {}}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">About BriskKart</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're revolutionizing online shopping with fast, reliable service and an exceptional customer experience. 
            Our mission is to make quality products accessible to everyone, everywhere.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Growth Analytics</h2>
          
          {/* Growth Metrics */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Monthly Growth</h3>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="customers" stroke="var(--color-customers)" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Revenue Trend</h3>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <AreaChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.3} />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

          {/* Category Performance and Customer Satisfaction */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Sales by Category</h3>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={categoryPerformanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="sales"
                    label={({ category, sales }) => `${category}: ${sales}%`}
                  >
                    {categoryPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Customer Satisfaction</h3>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={customerSatisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="satisfaction" fill="var(--color-satisfaction)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                  <p className="text-2xl font-bold text-blue-600">$89.50</p>
                  <p className="text-xs text-green-600">↑ 12% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Retention</p>
                  <p className="text-2xl font-bold text-green-600">84%</p>
                  <p className="text-xs text-green-600">↑ 8% from last quarter</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Speed</p>
                  <p className="text-2xl font-bold text-purple-600">1.8 days</p>
                  <p className="text-xs text-green-600">↓ 0.3 days improved</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Shops Section */}
        <NearbyShops />

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                BriskKart was founded in 2019 with a simple vision: to create the fastest, most reliable 
                online shopping experience possible. We noticed that customers were frustrated with slow 
                delivery times and complicated return processes.
              </p>
              <p>
                Starting as a small team of passionate entrepreneurs, we've grown into a trusted platform 
                serving thousands of customers worldwide. Our commitment to quality, speed, and customer 
                satisfaction remains at the heart of everything we do.
              </p>
              <p>
                Today, we partner with premium brands and local suppliers to bring you the best products 
                at competitive prices, all while maintaining our core values of transparency, reliability, 
                and exceptional service.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
              alt="BriskKart warehouse"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Speed & Reliability</h3>
              <p className="text-muted-foreground">
                We're committed to getting your orders to you as quickly as possible, 
                without compromising on safety or quality.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality First</h3>
              <p className="text-muted-foreground">
                Every product in our catalog is carefully selected and tested to meet 
                our high standards for quality and durability.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Customer Focused</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We're here to help with any questions 
                or concerns you might have.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
