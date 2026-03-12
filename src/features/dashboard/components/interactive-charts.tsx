import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Download, RefreshCw } from 'lucide-react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Enhanced colors for charts
const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0',
]

interface ChartDataPoint {
  name: string
  value: number
  value2?: number
  trend?: 'up' | 'down' | 'neutral'
}

interface KPIData {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
}

export function InteractiveOverview() {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching with different time ranges
    setIsLoading(true)
    const generateData = () => {
      const points =
        selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90
      return Array.from({ length: points }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (points - i - 1))
        return {
          name: date.toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          }),
          value: Math.floor(Math.random() * 5000) + 2000,
          value2: Math.floor(Math.random() * 3000) + 1000,
          trend:
            Math.random() > 0.5
              ? 'up'
              : Math.random() > 0.3
                ? 'down'
                : ('neutral' as 'up' | 'down' | 'neutral'),
        }
      })
    }

    setTimeout(() => {
      setData(generateData())
      setIsLoading(false)
    }, 500)
  }, [selectedTimeRange])

  const handleExport = () => {
    // Export functionality will be implemented in export phase
    console.log('Export chart data')
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setData(
        data.map((item) => ({
          ...item,
          value: Math.floor(Math.random() * 5000) + 2000,
          value2: Math.floor(Math.random() * 3000) + 1000,
        }))
      )
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <CardTitle>Revenue Overview</CardTitle>
        <div className='flex items-center gap-2'>
          <div className='flex rounded-md border'>
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setSelectedTimeRange(range)}
                className='h-8 px-3 text-xs'
              >
                {range === '7d' ? '7D' : range === '30d' ? '30D' : '90D'}
              </Button>
            ))}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefresh}
            disabled={isLoading}
            className='h-8'
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleExport}
            className='h-8'
          >
            <Download className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className='p-6'>
          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='text-muted-foreground'>Loading chart...</div>
            </div>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='colorValue2' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                <XAxis
                  dataKey='name'
                  className='text-muted-foreground'
                  fontSize={12}
                />
                <YAxis
                  className='text-muted-foreground'
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='#8884d8'
                  fillOpacity={1}
                  fill='url(#colorValue)'
                  strokeWidth={2}
                  name='Revenue'
                />
                <Area
                  type='monotone'
                  dataKey='value2'
                  stroke='#82ca9d'
                  fillOpacity={1}
                  fill='url(#colorValue2)'
                  strokeWidth={2}
                  name='Profit'
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function KPICards({ data }: { data: KPIData[] }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {data.map((kpi, index) => (
        <Card key={index} className='relative overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='flex size-8 items-center justify-center rounded-lg bg-muted'>
                  {kpi.icon}
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {kpi.title}
                  </p>
                  <p className='text-2xl font-bold'>{kpi.value}</p>
                </div>
              </div>
            </div>
            <div className='mt-4 flex items-center space-x-2'>
              <div
                className={cn(
                  'flex items-center space-x-1 text-xs',
                  kpi.trend === 'up'
                    ? 'text-green-600'
                    : kpi.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-600'
                )}
              >
                {kpi.trend === 'up' && <TrendingUp className='h-3 w-3' />}
                {kpi.trend === 'down' && <TrendingDown className='h-3 w-3' />}
                <span>{kpi.change}</span>
              </div>
            </div>
            {/* Mini sparkline */}
            <div className='absolute right-0 bottom-0 left-0 h-12 opacity-10'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={Array.from({ length: 20 }, () => ({
                    value: Math.random() * 100,
                  }))}
                >
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='currentColor'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function DistributionChart() {
  const [data] = useState([
    { name: 'Desktop', value: 400, percentage: 45 },
    { name: 'Mobile', value: 300, percentage: 33 },
    { name: 'Tablet', value: 100, percentage: 12 },
    { name: 'Other', value: 100, percentage: 10 },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name }) => {
                const item = data.find((d) => d.name === name)
                return `${name} ${item?.percentage || 0}%`
              }}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
