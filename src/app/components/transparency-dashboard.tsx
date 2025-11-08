'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Users,
  Home,
  HeartPulse,
  Wrench,
  BrainCircuit,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const GOAL = 500000;

const allocationData = [
  {
    name: 'Abrigo e Alimentação',
    value: 40,
    color: 'hsl(var(--chart-1))',
    icon: Home,
  },
  {
    name: 'Medicamentos e Saúde',
    value: 30,
    color: 'hsl(var(--chart-2))',
    icon: HeartPulse,
  },
  {
    name: 'Reconstrução Emergencial',
    value: 20,
    color: 'hsl(var(--chart-3))',
    icon: Wrench,
  },
  {
    name: 'Apoio Psicológico',
    value: 10,
    color: 'hsl(var(--chart-4))',
    icon: BrainCircuit,
  },
];

function AnimatedCounter({ to }: { to: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCount(Math.round(to * progress));

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(to);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [to]);

  return <span>{Math.round(count).toLocaleString('pt-BR')}</span>;
}

export function TransparencyDashboard() {
  const [raised, setRaised] = useState(0);
  const [donors, setDonors] = useState(0);

  useEffect(() => {
    // Simulate fetching data
    setRaised(125342);
    setDonors(1234);
  }, []);

  const progressValue = (raised / GOAL) * 100;

  return (
    <section id="transparencia" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Transparência Total
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
            Acompanhe em tempo real como sua doação está sendo usada.
          </p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target /> Meta de Arrecadação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2 text-sm">
              <span className="font-bold text-primary">
                R$ <AnimatedCounter to={raised} />
              </span>
              <span className="text-muted-foreground">
                Meta:{' '}
                {GOAL.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
            <Progress value={progressValue} className="h-4" />
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-muted-foreground">
                <Users className="mr-2 h-5 w-5" />
                <AnimatedCounter to={donors} /> doadores já contribuíram.
              </div>
              <div className="text-lg font-bold text-primary">
                {progressValue.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Destino dos Recursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                      }) => {
                        const radius =
                          innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-4">
                {allocationData.map((item) => (
                  <li key={item.name} className="flex items-center">
                    <span
                      className="h-4 w-4 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <item.icon className="h-5 w-5 mr-3 text-primary" />
                    <span>
                      {item.value}% - {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
