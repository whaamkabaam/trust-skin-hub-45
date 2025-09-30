import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { Link } from 'react-router-dom';

interface GlobalSearchProps {
  placeholder?: string;
  showFilters?: boolean;
}

export function GlobalSearch({ placeholder = "Search operators, content, reviews...", showFilters = true }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    rating: 'all'
  });
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const { results, loading, search } = useGlobalSearch();

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      search(debouncedQuery, filters);
    }
  }, [debouncedQuery, filters, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const formatResultType = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      operator: { label: 'Operator', color: 'bg-blue-100 text-blue-800' },
      review: { label: 'Review', color: 'bg-green-100 text-green-800' },
      content: { label: 'Content', color: 'bg-purple-100 text-purple-800' }
    };
    return types[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
  };

  const getResultLink = (result: any) => {
    switch (result.type) {
      case 'operator':
        return result.url || `/operators/${result.id}`;
      case 'review':
        return result.url || '/';
      case 'content':
        return result.url || '/';
      default:
        return '/';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              className="pl-10 pr-4"
              onClick={() => setIsOpen(true)}
              readOnly
            />
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="sr-only">Global Search</DialogTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="pl-10 pr-10"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {showFilters && (
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-32">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="operator">Operators</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading && query.length > 2 && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          )}

          {!loading && query.length <= 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Type at least 3 characters to search</p>
              <p className="text-xs mt-1">Search across operators, reviews, and content</p>
            </div>
          )}

          {!loading && query.length > 2 && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-xs mt-1">Try adjusting your search terms or filters</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-4">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              
              {results.map((result) => {
                const typeInfo = formatResultType(result.type);
                return (
                  <Link
                    key={`${result.type}-${result.id}`}
                    to={getResultLink(result)}
                    onClick={() => setIsOpen(false)}
                  >
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className={typeInfo.color}>
                                {typeInfo.label}
                              </Badge>
                              {result.rating && (
                                <Badge variant="outline">
                                  ⭐ {result.rating}/10
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium truncate">{result.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {result.excerpt}
                            </p>
                            {result.categories && result.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.categories.slice(0, 3).map((category) => (
                                  <Badge key={category} variant="outline" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                                {result.categories.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{result.categories.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}