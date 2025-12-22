import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Calendar, 
  Briefcase, 
  ArrowRight, 
  Bell,
  TrendingUp,
  Clock
} from 'lucide-react';
import { conferencesApi, opportunitiesApi, Conference } from '@/services/api';
import { format, differenceInDays, parseISO, isAfter } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [conferenceCount, setConferenceCount] = useState(0);
  const [opportunityCount, setOpportunityCount] = useState(0);
  const [upcomingConferences, setUpcomingConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conferences, opportunities] = await Promise.all([
          conferencesApi.getAll(),
          opportunitiesApi.getAll(),
        ]);
        
        setConferenceCount(conferences.length);
        setOpportunityCount(opportunities.length);

        // Find conferences in the next 7 days
        const now = new Date();
        const upcoming = conferences.filter((conf) => {
          const confDate = parseISO(conf.date);
          const daysUntil = differenceInDays(confDate, now);
          return isAfter(confDate, now) && daysUntil <= 7;
        });
        setUpcomingConferences(upcoming);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your research interests today.
        </p>
      </div>

      {/* Notification Banner */}
      {upcomingConferences.length > 0 && (
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Upcoming Conferences</p>
              <p className="text-sm text-muted-foreground">
                You have {upcomingConferences.length} conference{upcomingConferences.length > 1 ? 's' : ''} in the next 7 days
              </p>
            </div>
            <Link to="/conferences">
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conferences
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Calendar className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{conferenceCount}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Academic events available
            </p>
          </CardContent>
        </Card>

        <Card className="group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Research Opportunities
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{opportunityCount}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Internships & positions
            </p>
          </CardContent>
        </Card>

        <Card className="group md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Coming Up Soon
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{upcomingConferences.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Events in next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold font-display">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/conferences" className="group">
            <Card className="h-full transition-all hover:shadow-elevated hover:border-primary/30">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-display">Browse Conferences</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover academic events worldwide
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/opportunities" className="group">
            <Card className="h-full transition-all hover:shadow-elevated hover:border-accent/30">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-display">Find Opportunities</h3>
                    <p className="text-sm text-muted-foreground">
                      Research internships & positions
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Upcoming Conferences Preview */}
      {upcomingConferences.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-display">Happening Soon</h2>
            <Link to="/conferences">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4">
            {upcomingConferences.slice(0, 3).map((conference) => (
              <Card key={conference.id} className="animate-slide-up">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="text-xs font-medium">
                        {format(parseISO(conference.date), 'MMM')}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {format(parseISO(conference.date), 'd')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{conference.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {conference.venue}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{conference.topic}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
