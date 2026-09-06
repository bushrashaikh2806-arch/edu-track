"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { weeklyTrend, monthlyTrend, semesterTrend } from "@/lib/mock-data"

const chartConfig = {
  present: { label: "Present", color: "var(--chart-1)" },
  late: { label: "Late", color: "var(--chart-3)" },
  absent: { label: "Absent", color: "var(--chart-2)" },
} satisfies ChartConfig

const datasets = {
  week: weeklyTrend,
  month: monthlyTrend,
  semester: semesterTrend,
}

export function AttendanceChart() {
  const [period, setPeriod] = useState<keyof typeof datasets>("week")
  const data = datasets[period]

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Attendance overview</CardTitle>
          <CardDescription>
            Present, late and absent trends across the institution.
          </CardDescription>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as keyof typeof datasets)}>
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="semester">Semester</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="late" fill="var(--color-late)" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
