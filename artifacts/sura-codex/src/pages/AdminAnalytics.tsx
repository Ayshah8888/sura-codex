import React from "react";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const renderSection = (title: string, items: any[] | undefined, dataKey: string) => {
    if (!items || items.length === 0) {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-serif">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data available.</p>
          </CardContent>
        </Card>
      );
    }

    const chartData = items.slice(0, 5).map(item => ({
      name: item.title.substring(0, 15) + "...",
      [dataKey]: item.count,
    }));

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-serif">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                <Bar dataKey={dataKey} fill="#C5A58A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-muted-foreground font-mono text-xs">{i + 1}</span>
                  <Badge variant="outline" className="text-[10px] py-0">{item.type}</Badge>
                  <Link href={`/${item.type}s/${item.id}`} className="text-sm font-medium hover:text-primary truncate">
                    {item.title}
                  </Link>
                </div>
                <span className="text-sm font-semibold ml-2 shrink-0">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>
      
      <h1 className="font-serif text-4xl mb-8">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderSection("Most Liked", analytics?.topLiked, "Likes")}
        {renderSection("Most Shared", analytics?.topShared, "Shares")}
        {renderSection("Most Commented", analytics?.topCommented, "Comments")}
      </div>
    </div>
  );
}