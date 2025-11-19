"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type ChartData = { date: string; positif: number; negatif: number };

const chartConfig = {
    positif: {
        label: "Positif",
        color: "hsl(var(--primary))",
    },
    negatif: {
        label: "Negatif",
        color: "hsl(var(--destructive))",
    },
} satisfies ChartConfig

export function SentimentChart({ chartData }: { chartData: ChartData[] }) {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = React.useMemo(() => {
        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }

        const startDate = new Date(now);
        startDate.setDate(now.getDate() - daysToSubtract);
        startDate.setHours(0, 0, 0, 0);

        return chartData.filter((item) => new Date(item.date) >= startDate);
    }, [chartData, timeRange])

    return (
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-left">
                    <CardTitle>Analisis Sentimen</CardTitle>
                    <CardDescription>
                        Menampilkan total sentimen per hari
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[180px] rounded-lg sm:ml-auto"
                        aria-label="Pilih periode"
                    >
                        <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">3 bulan terakhir</SelectItem>
                        <SelectItem value="30d" className="rounded-lg">30 hari terakhir</SelectItem>
                        <SelectItem value="7d" className="rounded-lg">7 hari terakhir</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[300px] w-full"
                >
                    <BarChart accessibilityLayer data={filteredData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("id-ID", { month: "short", day: "numeric" })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    labelFormatter={(value) => new Date(value).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                />
                            }
                        />
                        <Bar
                            dataKey="positif"
                            fill="var(--color-positif)"
                            radius={4}
                        />
                        <Bar
                            dataKey="negatif"
                            fill="var(--color-negatif)"
                            radius={4}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
