import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Radar, 
  Calendar, 
  Briefcase, 
  ArrowRight,
  Sparkles,
  Globe,
  Users
} from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      icon: Calendar,
      title: 'Academic Conferences',
      description: 'Discover conferences worldwide, filtered by topic and sorted by date.',
    },
    {
      icon: Briefcase,
      title: 'Research Opportunities',
      description: 'Find internships, fellowships, and research positions from top institutions.',
    },
    {
      icon: Sparkles,
      title: 'Smart Notifications',
      description: 'Get reminded about upcoming conferences and deadlines.',
    },
  ];

  const stats = [
    { icon: Globe, value: '500+', label: 'Conferences' },
    { icon: Users, value: '10K+', label: 'Researchers' },
    { icon: Briefcase, value: '200+', label: 'Opportunities' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow animate-float">
                <Radar className="h-9 w-9" />
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight">
                Discover Research with{' '}
                <span className="gradient-text">ResearchRadar</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover conferences, find research opportunities, and connect with the academic community — all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="xl" variant="gradient" className="w-full sm:w-auto gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 pt-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold font-display">{stat.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-display mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Streamline your academic journey with powerful tools designed for researchers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="group animate-slide-up border-0 shadow-elevated"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold font-display mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground overflow-hidden">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
              Ready to accelerate your research journey?
            </h2>
            <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
              Join thousands of researchers discovering opportunities worldwide.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-primary" />
              <span className="font-semibold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ResearchRadar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ResearchRadar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
