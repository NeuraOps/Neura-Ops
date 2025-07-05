import { useState, useEffect } from 'react';
import axios from 'axios';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface CustomerOrder {
  totalOrders: number;
  totalQuantity: number;
  customerId: string;
  customerName: string;
  sellingPrice: number;
}

interface ProductOrder {
  totalOrders: number;
  totalQuantity: number;
  productId: string;
  productName: string;
  sellingPrice: number;
}

const monthlyData = [
  { month: 'Jan', orders: 125, revenue: 425000, target: 400000 },
  { month: 'Feb', orders: 132, revenue: 438000, target: 410000 },
  { month: 'Mar', orders: 141, revenue: 452000, target: 420000 },
  { month: 'Apr', orders: 138, revenue: 445000, target: 430000 },
  { month: 'May', orders: 145, revenue: 460000, target: 440000 },
  { month: 'Jun', orders: 152, revenue: 478000, target: 450000 },
  { month: 'Jul', orders: 158, revenue: 492000, target: 460000 },
  { month: 'Aug', orders: 162, revenue: 505000, target: 470000 },
  { month: 'Sep', orders: 168, revenue: 520000, target: 480000 },
  { month: 'Oct', orders: 175, revenue: 535000, target: 490000 },
  { month: 'Nov', orders: 182, revenue: 550000, target: 500000 },
  { month: 'Dec', orders: 188, revenue: 565000, target: 510000 },
];

export function SalesChart() {
  const [viewType, setViewType] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerOrder[]>([]);
  const [productData, setProductData] = useState<ProductOrder[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [customerResponse, productResponse] = await Promise.all([
          axios.get(
            'http://localhost:3000/api/v1/orders/orders-by-customer',
            {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
              },
            }
          ),
          axios.get(
            'http://localhost:3000/api/v1/orders/orders-by-product',
            {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
          )
        ]);

        // Transform customer data for visualization
        const transformedCustomerData = customerResponse.data.orders.map((order: CustomerOrder) => ({
          name: order.customerName,
          orders: order.totalOrders,
          quantity: order.totalQuantity,
          // Simulate revenue based on quantity (you can adjust this calculation)
          revenue: order.totalQuantity * order.sellingPrice
        }));

        // Transform product data for visualization
        const transformedProductData = productResponse.data.orders.map((order: ProductOrder) => ({
          name: order.productName,
          orders: order.totalOrders,
          quantity: order.totalQuantity,
          // Simulate revenue based on quantity (you can adjust this calculation)
          revenue: order.totalQuantity * order.sellingPrice
        }));

        setCustomerData(transformedCustomerData);
        setProductData(transformedProductData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-6 flex justify-center items-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Tabs defaultValue="product" onValueChange={setViewType} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              {/* <TabsTrigger value="monthly">Monthly</TabsTrigger> */}
              <TabsTrigger value="product">By Product</TabsTrigger>
              <TabsTrigger value="customer">By Customer</TabsTrigger>
            </TabsList>
          </div>
          
          {/* <TabsContent value="monthly" className="mt-2">
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value, name) => {
                    if (name === 'revenue' || name === 'target') {
                      return [formatCurrency(value as number), name === 'revenue' ? 'Revenue' : 'Target'];
                    }
                    return [value, 'Orders'];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  fill="hsl(var(--chart-1))" 
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent> */}
          
          <TabsContent value="product" className="mt-2">
            <ResponsiveContainer width="100%" height={330}>
              <ComposedChart
                data={productData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value, name, props) => {
                    const { dataKey } = props.payload;
                    
                    if (dataKey === 'revenue') {
                      return [formatCurrency(value as number), 'Revenue'];
                    }
                    if (dataKey === 'quantity') {
                      return [value, 'Quantity'];
                    }
                    if (dataKey === 'orders') {
                      return [value, 'Orders'];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  fill="hsl(var(--chart-1))" 
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="customer" className="mt-2">
            <ResponsiveContainer width="100%" height={330}>
              <ComposedChart
                data={customerData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value, name, props) => {
                    const { dataKey } = props.payload;
                    
                    if (dataKey === 'revenue') {
                      return [formatCurrency(value as number), 'Revenue'];
                    }
                    if (dataKey === 'quantity') {
                      return [value, 'Quantity'];
                    }
                    if (dataKey === 'orders') {
                      return [value, 'Orders'];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  fill="hsl(var(--chart-1))" 
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}