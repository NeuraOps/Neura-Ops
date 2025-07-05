import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Columns } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  LineChart,
  Lightbulb,
  Settings,
  TrendingDown,
  TrendingUp,
  Zap,
  DollarSign,
  Users,
  Wrench,
  ShieldCheck,
  AlertCircle,
  Activity,
  PieChart,
  Gauge,
  Boxes,
  Truck
} from 'lucide-react';
import { useManufacturingData } from '@/hooks/useManufacturingData';
import axios from 'axios';

const predictiveInsights = [
  {
    title: 'Production Forecast',
    icon: LineChart,
    value: '+5.2%',
    metric: 'Next 24 Hours',
    progress: 85,
    description: 'Expected to exceed target by 52 units',
    color: 'emerald'
  },
  {
    title: 'Maintenance Prediction',
    icon: Wrench,
    value: '87%',
    metric: 'Machine Health',
    progress: 87,
    description: 'Maintenance recommended within 48 hours',
    color: 'amber'
  },
  {
    title: 'Quality Forecast',
    icon: ShieldCheck,
    value: '98.5%',
    metric: 'Expected Quality Rate',
    progress: 92,
    description: 'Trending towards target quality levels',
    color: 'emerald'
  },
  {
    title: 'Resource Optimization',
    icon: Gauge,
    value: '+8.5%',
    metric: 'Efficiency Potential',
    progress: 65,
    description: '3 optimization opportunities identified',
    color: 'emerald'
  }
];

const staticinsights = [
  {
    id: 'oee-optimization',
    title: 'OEE Optimization',
    type: 'performance',
    severity: 'warning',
    metrics: [
      {
        name: 'Current OEE',
        value: '82.5%',
        target: '85%',
        status: 'below',
        trend: '+2.3% vs last week'
      },
      {
        name: 'Availability',
        value: '92.5%',
        target: '95%',
        status: 'below',
        trend: '-1.2% vs last week'
      },
      {
        name: 'Performance',
        value: '88.3%',
        target: '90%',
        status: 'below',
        trend: '+3.5% vs last week'
      }
    ],
    recommendations: [
      'Implement predictive maintenance to reduce unplanned downtime',
      'Optimize changeover procedures to improve availability',
      'Review and adjust machine speeds for optimal performance',
      'Schedule maintenance during non-peak hours',
      'Implement real-time monitoring system for critical equipment'
    ],
    impact: {
      financial: '+$45,000 monthly',
      productivity: '+15% output',
      timeframe: '3 months'
    }
  },
  {
    id: 'inventory-alerts',
    title: 'Inventory Optimization',
    type: 'warning',
    severity: 'danger',
    metrics: [
      {
        name: 'Stock Level',
        value: '35%',
        target: '40%',
        status: 'below',
        trend: '-5.2% vs last week'
      },
      {
        name: 'Critical Materials',
        value: '3',
        target: '0',
        status: 'below',
        trend: '+2 vs last week'
      },
      {
        name: 'Stockout Risk',
        value: 'High',
        target: 'Low',
        status: 'below',
        trend: 'Increasing'
      }
    ],
    recommendations: [
      'Place immediate orders for materials below reorder point',
      'Review and adjust safety stock levels based on lead times',
      'Implement vendor-managed inventory for critical materials',
      'Establish secondary supplier relationships',
      'Optimize order quantities using AI-driven demand forecasting'
    ],
    impact: {
      financial: '-$32,000 holding cost',
      efficiency: '+25% inventory turnover',
      timeframe: '1 month'
    }
  },
  {
    id: 'cost-reduction',
    title: 'Cost Optimization',
    type: 'efficiency',
    severity: 'warning',
    metrics: [
      {
        name: 'Cost per Unit',
        value: '$12.47',
        target: '$10.00',
        status: 'below',
        trend: '-$0.42 vs last month'
      },
      {
        name: 'Material Waste',
        value: '4.2%',
        target: '3.0%',
        status: 'below',
        trend: '-0.3% vs last month'
      },
      {
        name: 'Labor Efficiency',
        value: '82%',
        target: '90%',
        status: 'below',
        trend: '+2% vs last month'
      }
    ],
    recommendations: [
      'Optimize material usage through better cutting patterns',
      'Implement labor scheduling based on production demand',
      'Review supplier contracts for potential cost savings',
      'Automate repetitive processes to reduce labor costs',
      'Implement energy efficiency measures'
    ],
    impact: {
      financial: '-$28,000 monthly costs',
      efficiency: '+12% resource utilization',
      timeframe: '2 months'
    }
  },
  {
    id: 'quality-improvement',
    title: 'Quality Enhancement',
    type: 'quality',
    severity: 'warning',
    metrics: [
      {
        name: 'Quality Rate',
        value: '97.2%',
        target: '98%',
        status: 'below',
        trend: '+0.8% vs last month'
      },
      {
        name: 'Defect Rate',
        value: '2.8%',
        target: '2%',
        status: 'below',
        trend: '-0.3% vs last month'
      },
      {
        name: 'First Pass Yield',
        value: '94%',
        target: '96%',
        status: 'below',
        trend: '+1.2% vs last month'
      }
    ],
    recommendations: [
      'Implement additional quality checks at critical process points',
      'Provide operator training on quality standards',
      'Review and update quality control procedures',
      'Install vision inspection systems',
      'Implement statistical process control (SPC)'
    ],
    impact: {
      financial: '-$35,000 scrap reduction',
      quality: '+2.5% yield improvement',
      timeframe: '2 months'
    }
  }
];

export function AIInsightsCard({ refreshKey }: { refreshKey: number }) {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('realtime');

  const supplyChainInsight = {
    id: 'supply-chain',
    title: 'Supply Chain Intelligence',
    type: 'logistics',
    severity: 'warning',
    metrics: [
      {
        name: 'Supplier Performance',
        value: '88%',
        target: '95%',
        status: 'below',
        trend: '-2.5% vs last month'
      },
      {
        name: 'Lead Time Variance',
        value: '12.5%',
        target: '5%',
        status: 'below',
        trend: '+3.2% vs last month'
      },
      {
        name: 'Order Fulfillment',
        value: '94.2%',
        target: '98%',
        status: 'below',
        trend: '-1.8% vs last month'
      }
    ],
    recommendations: [
      'Implement real-time supplier performance tracking',
      'Establish vendor scorecards and KPIs',
      'Optimize order quantities based on lead time analysis',
      'Develop contingency plans for critical materials',
      'Implement automated supplier communication system'
    ],
    impact: {
      financial: '-$65,000 logistics cost',
      efficiency: '+15% delivery reliability',
      timeframe: '4 months'
    }
  };

  const energyInsight = {
    id: 'energy-optimization',
    title: 'Energy Intelligence',
    type: 'energy',
    severity: 'warning',
    metrics: [
      {
        name: 'Energy Efficiency',
        value: '82%',
        target: '90%',
        status: 'below',
        trend: '+1.5% vs last month'
      },
      {
        name: 'Peak Load',
        value: '875 kW',
        target: '800 kW',
        status: 'below',
        trend: '-25 kW vs last month'
      },
      {
        name: 'Carbon Footprint',
        value: '42 MT',
        target: '35 MT',
        status: 'below',
        trend: '-2.3 MT vs last month'
      }
    ],
    recommendations: [
      'Implement smart energy monitoring system',
      'Optimize equipment startup sequence',
      'Schedule high-energy operations during off-peak hours',
      'Upgrade to energy-efficient lighting systems',
      'Install heat recovery systems'
    ],
    impact: {
      financial: '-$28,000 energy cost',
      sustainability: '-15% carbon emissions',
      productivity: "None",
      timeframe: '6 months'
    }
  };

  const workforceInsight = {
    id: 'workforce-optimization',
    title: 'Workforce Intelligence',
    type: 'workforce',
    severity: 'success',
    metrics: [
      {
        name: 'Labor Utilization',
        value: '92%',
        target: '90%',
        status: 'above',
        trend: '+3.5% vs last month'
      },
      {
        name: 'Skill Coverage',
        value: '85%',
        target: '95%',
        status: 'below',
        trend: '+5% vs last month'
      },
      {
        name: 'Training Compliance',
        value: '96%',
        target: '100%',
        status: 'below',
        trend: '+2% vs last month'
      }
    ],
    recommendations: [
      'Implement skill-based routing system',
      'Develop cross-training program',
      'Optimize shift patterns based on demand',
      'Implement digital training modules',
      'Deploy automated performance tracking'
    ],
    impact: {
      financial: '+$42,000 productivity gains',
      efficiency: '+18% workforce utilization',
      timeframe: '3 months'
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <BarChart3 className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'efficiency':
        return <Settings className="h-5 w-5" />;
      case 'quality':
        return <Zap className="h-5 w-5" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5" />;
      case 'process':
        return <Activity className="h-5 w-5" />;
      case 'logistics':
        return <Truck className="h-5 w-5" />;
      case 'energy':
        return <Zap className="h-5 w-5" />;
      case 'workforce':
        return <Users className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'text-destructive';
      case 'warning':
        return 'text-amber-500';
      case 'success':
        return 'text-emerald-500';
      default:
        return 'text-primary';
    }
  };

  const [insights, setInsights] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        'http://localhost:3000/api/v1/ai/latest-airesponse',
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );

      if (response.data && response.data.success && response.data.data) {
        setInsights(response.data.data);
      } else {
        setError('AI response format is invalid');
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 404) {
          setError('AI insights service not found. Please contact support.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch AI insights');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [refreshKey]);


  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime">
            <Activity className="mr-2 h-4 w-4" />
            Real-time Monitoring
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Brain className="mr-2 h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <LineChart className="mr-2 h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Alerts</CardTitle>
                <CardDescription>Critical events requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea >
                  <div className="space-y-4">
                    {Array.isArray(insights.format_1) && insights.format_1.map((alert) => (
                      <div
                        key={alert.id}
                        className={`rounded-lg border p-4 ${alert.severity === 'critical'
                          ? 'border-red-500/50 bg-red-500/10'
                          : alert.severity === 'warning'
                            ? 'border-amber-500/50 bg-amber-500/10'
                            : 'border-blue-500/50 bg-blue-500/10'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {alert.severity === 'critical' ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : alert.severity === 'warning' ? (
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-blue-500" />
                            )}
                            <div className="font-medium">{alert.title}</div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{alert.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          {alert.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Metrics</CardTitle>
                <CardDescription>Real-time performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Array.isArray(insights.format_2) && insights.format_2.map((single) => (
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{single.title}</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                          {single.metricValue}
                          <span className="text-sm font-normal text-muted-foreground">
                            {' '}
                            {single.unit}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <Columns className="h-4 w-4 text-indigo-500" />
                          <span className="text-muted-foreground">{single.comparativeInsight}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Boxes className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Current Batch</span>
                      </div>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span>234/500 units</span>
                      </div>
                      <Progress value={46.8} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Started: 2h ago</span>
                        <span>ETA: 3h 15m</span>
                      </div>
                    </div>
                  </div> */}

                  {Array.isArray(insights.format_11) && insights.format_11.slice(0, 3).map((single) => (
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Boxes className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{single.batch}</span>
                        </div>
                        <Badge variant="outline">{single.status}</Badge>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completed</span>
                          <span>{single.completedUnits}/{single.totalUnits}units</span>
                        </div>
                        <Progress value={46.8} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Started: {single.startedAgo}</span>
                          <span>ETA: {single.eta}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>
                  Real-time analysis and recommendations for operational improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {Array.isArray(insights.format_1) && insights.format_7.map((insight) => (
                      <div
                        key={insight.id}
                        className={`rounded-lg border p-4 transition-colors hover:bg-muted/50 ${activeInsight === insight.id ? 'bg-muted' : ''
                          }`}
                        onClick={() => setActiveInsight(insight.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full bg-primary/10 p-2 ${getSeverityColor(insight.severity)}`}>
                              {getInsightIcon(insight.type)}
                            </div>
                            <div>
                              <div className="font-medium">{insight.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {insight.metrics[0].value} vs {insight.metrics[0].target} target
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${getSeverityColor(insight.severity)} bg-${insight.severity}/10`}
                          >
                            {insight.severity === 'success' ? 'Optimized' : 'Needs Attention'}
                          </Badge>
                        </div>

                        {activeInsight === insight.id && (
                          <div className="mt-4 space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                              {insight.metrics.map((metric: any, index: number) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>{metric.name}</span>
                                    <span className={getSeverityColor(insight.severity)}>
                                      {metric.value}
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      typeof metric.value === 'string' && metric.value.includes('%')
                                        ? parseFloat(metric.value)
                                        : 75
                                    }
                                    className="h-2"
                                  />
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Target: {metric.target}</span>
                                    <div className="flex items-center gap-1">
                                      <span>{metric.trend}</span>
                                      {metric.status === 'above' ? (
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4 text-destructive" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* <div className="rounded-lg border p-3 bg-muted/50">
                              <div className="font-medium mb-2">Expected Impact</div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <div className="text-muted-foreground">Financial</div>
                                  <div className="font-medium">{insight.impact.financial}</div>
                                </div>
                                {insight.impact.productivity && (
                                  <div>
                                    <div className="text-muted-foreground">Productivity</div>
                                    <div className="font-medium">{insight.impact.productivity}</div>
                                  </div>
                                )}
                                {insight.impact.efficiency && (
                                  <div>
                                    <div className="text-muted-foreground">Efficiency</div>
                                    <div className="font-medium">{insight.impact.efficiency}</div>
                                  </div>
                                )}
                                {insight.impact.quality && (
                                  <div>
                                    <div className="text-muted-foreground">Quality</div>
                                    <div className="font-medium">{insight.impact.quality}</div>
                                  </div>
                                )}
                                {insight.impact.availability && (
                                  <div>
                                    <div className="text-muted-foreground">Availability</div>
                                    <div className="font-medium">{insight.impact.availability}</div>
                                  </div>
                                )}
                                {insight.impact.sustainability && (
                                  <div>
                                    <div className="text-muted-foreground">Sustainability</div>
                                    <div className="font-medium">{insight.impact.sustainability}</div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-muted-foreground">Timeframe</div>
                                  <div className="font-medium">{insight.impact.timeframe}</div>
                                </div>
                              </div>
                            </div> */}

                            <div className="space-y-2">
                              <div className="font-medium">AI Recommendations</div>
                              <ul className="space-y-2">
                                {insight.recommendations.map((recommendation: any, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Lightbulb className="h-4 w-4 mt-1 text-primary" />
                                    <span className="text-sm">{recommendation}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <Button className="w-full">
                              View Detailed Analysis
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Analysis</CardTitle>
                <CardDescription>Projected benefits of recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      <div className="font-medium">Financial Impact</div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-emerald-500">+$248,000</div>
                      <p className="text-sm text-muted-foreground">
                        Projected annual savings
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div className="font-medium">Efficiency Gains</div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-blue-500">+18.5%</div>
                      <p className="text-sm text-muted-foreground">
                        Overall efficiency improvement
                      </p>
                    </div>
                  </div> */}

                  {Array.isArray(insights.format_12) && insights.format_12.slice(0,3).map((insight, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className={`h-5 w-5 text-${insight.color}-500`} />
                        <div className="font-medium">{insight.category}</div>
                      </div>
                      <div className="mt-2">
                        <div className={`text-2xl font-bold text-${insight.color}-500`}>{insight.value}</div>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  ))}


                  <Button className="w-full">
                    <PieChart className="mr-2 h-4 w-4" />
                    View Detailed ROI Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Advanced Predictions</CardTitle>
                <CardDescription>AI-powered forecasts and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.isArray(insights.format_8) && insights.format_8.map((insight, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <LineChart className={`h-5 w-5 text-${insight.color}-500`} />
                        <div className="font-medium">{insight.title}</div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{insight.metric}</span>
                          <span className={`text-${insight.color}-500`}>
                            {insight.value}
                          </span>
                        </div>
                        <Progress
                          value={insight.progress}
                          className="mt-2 h-2"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>Long-term performance projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      <div className="font-medium">Production Trend</div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Q4 2024 Forecast</span>
                        <span className="text-emerald-500">+12.5%</span>
                      </div>
                      <Progress value={85} className="mt-2 h-2" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Steady growth trajectory expected
                      </p>
                    </div>
                  </div> */}

                  {Array.isArray(insights.format_8) && insights.format_8.slice(0, 3).map((insight, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <LineChart className={`h-5 w-5 text-${insight.color}-500`} />
                        <div className="font-medium">{insight.title}</div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{insight.metric}</span>
                          <span className={`text-${insight.color}-500`}>
                            {insight.value}
                          </span>
                        </div>
                        <Progress
                          value={insight.progress}
                          className="mt-2 h-2"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      <div className="font-medium">Capacity Utilization</div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Next Quarter</span>
                        <span className="text-amber-500">92%</span>
                      </div>
                      <Progress value={92} className="mt-2 h-2" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Approaching maximum capacity
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Repeat className="h-5 w-5 text-primary" />
                      <div className="font-medium">Maintenance Forecast</div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Next 30 Days</span>
                        <span className="text-blue-500">3 Events</span>
                      </div>
                      <Progress value={65} className="mt-2 h-2" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Scheduled maintenance optimization
                      </p>
                    </div>
                  </div> */}

                  <Button className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Forecast Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}