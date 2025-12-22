import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { conferencesApi, Conference } from '@/services/api';
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Search, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Conferences: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const data = await conferencesApi.getAll();
        setConferences(data);
      } catch (error) {
        console.error('Failed to fetch conferences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConferences();
  }, []);

  // Extract unique topics for filter
  const topics = useMemo(() => {
    const uniqueTopics = [...new Set(conferences.map((c) => c.topic))];
    return uniqueTopics.sort();
  }, [conferences]);

  // Filtered and sorted conferences
  const filteredConferences = useMemo(() => {
    let result = [...conferences];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.venue.toLowerCase().includes(query) ||
          c.topic.toLowerCase().includes(query)
      );
    }

    // Topic filter
    if (selectedTopic !== 'all') {
      result = result.filter((c) => c.topic === selectedTopic);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [conferences, searchQuery, selectedTopic, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading conferences..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display">Conferences</h1>
        <p className="text-muted-foreground">
          Discover academic conferences and events from around the world
        </p>
      </div>

      {/* Filters */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conferences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                title={`Sort by ${sortOrder === 'latest' ? 'oldest' : 'latest'}`}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredConferences.length} conference{filteredConferences.length !== 1 ? 's' : ''} found
        </p>
        {sortOrder === 'latest' ? (
          <Badge variant="secondary">Showing latest first</Badge>
        ) : (
          <Badge variant="secondary">Showing oldest first</Badge>
        )}
      </div>

      {/* Conference List */}
      {filteredConferences.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No conferences found"
          description="Try adjusting your search or filter criteria to find what you're looking for."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredConferences.map((conference, index) => (
            <Card 
              key={conference.id} 
              className="group animate-slide-up flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-xs">
                    {conference.topic}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {conference.source}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight mt-2 group-hover:text-primary transition-colors">
                  {conference.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>{format(parseISO(conference.date), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{conference.venue}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <a
                    href={conference.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Register
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Conferences;
