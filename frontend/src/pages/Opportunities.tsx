import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { opportunitiesApi, Opportunity } from '@/services/api';
import { 
  Briefcase, 
  Building2, 
  ExternalLink, 
  Search,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await opportunitiesApi.getAll();
        setOpportunities(data);
      } catch (error) {
        console.error('Failed to fetch opportunities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filtered and sorted opportunities
  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          o.organization.toLowerCase().includes(query)
      );
    }

    // Sort by most recent (assuming createdAt exists, fallback to original order)
    result.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      }
      return 0;
    });

    return result;
  }, [opportunities, searchQuery, sortOrder]);

  // Check if opportunity is research/internship related
  const isResearchRole = (title: string): boolean => {
    const keywords = ['research', 'internship', 'intern', 'fellow', 'fellowship', 'scholar'];
    return keywords.some((keyword) => title.toLowerCase().includes(keyword));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading opportunities..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display">Research Opportunities</h1>
        <p className="text-muted-foreground">
          Discover research internships, fellowships, and academic positions
        </p>
      </div>

      {/* Search and Sort */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'latest' ? 'Latest first' : 'Oldest first'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredOpportunities.length} opportunit{filteredOpportunities.length !== 1 ? 'ies' : 'y'} found
      </p>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No opportunities found"
          description="Try adjusting your search criteria to find what you're looking for."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredOpportunities.map((opportunity, index) => (
            <Card 
              key={opportunity.id} 
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  {isResearchRole(opportunity.title) && (
                    <Badge className="bg-accent text-accent-foreground gap-1">
                      <Sparkles className="h-3 w-3" />
                      Research / Internship
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {opportunity.source}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight mt-2 group-hover:text-primary transition-colors">
                  {opportunity.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>{opportunity.organization}</span>
                </div>
                <a
                  href={opportunity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Opportunity
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
