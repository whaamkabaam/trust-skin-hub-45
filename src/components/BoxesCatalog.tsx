import { useState } from 'react';
import { ChevronUp, ChevronDown, Package, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BoxCategory {
  id: string;
  name: string;
  icon: string;
  boxCount: number;
  averageEV: number;
  houseEdge: number;
}

type SortField = 'name' | 'boxCount' | 'averageEV' | 'houseEdge';
type SortDirection = 'asc' | 'desc';

const sampleCategories: BoxCategory[] = [
  {
    id: '1',
    name: 'Covert/Weapon Cases',
    icon: '🔫',
    boxCount: 47,
    averageEV: 28.50,
    houseEdge: 12
  },
  {
    id: '2', 
    name: 'Streetwear',
    icon: '👕',
    boxCount: 23,
    averageEV: 45.20,
    houseEdge: 18
  },
  {
    id: '3',
    name: 'Electronics',
    icon: '📱',
    boxCount: 15,
    averageEV: 125.80,
    houseEdge: 22
  },
  {
    id: '4',
    name: 'Knife Cases',
    icon: '🔪',
    boxCount: 12,
    averageEV: 89.90,
    houseEdge: 14
  },
  {
    id: '5',
    name: 'Stickers & Graffiti',
    icon: '🎨',
    boxCount: 34,
    averageEV: 8.75,
    houseEdge: 9
  }
];

const BoxesCatalog = () => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isLoading, setIsLoading] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCategories = [...sampleCategories].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'boxCount':
        return multiplier * (a.boxCount - b.boxCount);
      case 'averageEV':
        return multiplier * (a.averageEV - b.averageEV);
      case 'houseEdge':
        return multiplier * (a.houseEdge - b.houseEdge);
      default:
        return 0;
    }
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors group w-full text-left"
    >
      {children}
      <div className="flex flex-col">
        <ChevronUp className={cn(
          "w-3 h-3 transition-colors",
          sortField === field && sortDirection === 'asc' ? "text-primary" : "text-muted-foreground/50"
        )} />
        <ChevronDown className={cn(
          "w-3 h-3 transition-colors -mt-1",
          sortField === field && sortDirection === 'desc' ? "text-primary" : "text-muted-foreground/50"
        )} />
      </div>
    </button>
  );

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50">
        <CardContent className="p-0">
          {/* Desktop Loading */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-lg">
              <Table>
                <TableHeader className="bg-background/60 backdrop-blur-sm sticky top-0">
                  <TableRow className="border-b border-border/50">
                    <TableHead className="text-left font-semibold">Category</TableHead>
                    <TableHead className="text-center font-semibold">Number of Boxes</TableHead>
                    <TableHead className="text-right font-semibold">Average EV</TableHead>
                    <TableHead className="text-right font-semibold">House Edge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(4)].map((_, i) => (
                    <TableRow key={i} className="hover:bg-background/60 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="h-4 bg-muted rounded w-8 mx-auto animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-muted rounded w-16 ml-auto animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-4 bg-muted rounded w-12 ml-auto animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Loading */}
          <div className="md:hidden p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-background/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                    <div className="h-5 bg-muted rounded w-32 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full w-16 animate-pulse" />
                    <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
                    <div className="h-6 bg-muted rounded-full w-14 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-lg">
              <Table>
                <TableHeader className="bg-background/60 backdrop-blur-sm sticky top-0">
                  <TableRow className="border-b border-border/50">
                    <TableHead className="text-left font-semibold">
                      <SortButton field="name">Category</SortButton>
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      <div className="flex items-center justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <SortButton field="boxCount">Number of Boxes</SortButton>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>How many items are in this category</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      <div className="flex items-center justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <SortButton field="averageEV">Average EV</SortButton>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average value of items received per open in this category</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      <div className="flex items-center justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <SortButton field="houseEdge">House Edge</SortButton>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>How much the site keeps on average for this category</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCategories.map((category) => (
                    <TableRow 
                      key={category.id} 
                      className="hover:bg-background/60 transition-colors cursor-pointer group hover:shadow-sm"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {category.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {category.boxCount}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${category.averageEV.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {category.houseEdge}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Desktop Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border/50 bg-background/40">
              <span className="text-sm text-muted-foreground">
                {sortedCategories.length} categories total
              </span>
              <Button size="sm" variant="outline" asChild>
                <a href="#all-cases" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  See all boxes/cases
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-3">
            {sortedCategories.map((category) => (
              <Card key={category.id} className="bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg">{category.icon}</span>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.boxCount} Boxes
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ${category.averageEV.toFixed(2)} Avg EV
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {category.houseEdge}% Edge
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default BoxesCatalog;