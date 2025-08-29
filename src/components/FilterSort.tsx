import { useState } from 'react';
import { ChevronDown, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FilterSortProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  filters: {
    games: string[];
    modes: string[];
    paymentMethods: string[];
    kycRequired: boolean | null;
    verified: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

const FilterSort = ({ 
  view, 
  onViewChange, 
  sortBy, 
  onSortChange, 
  filters, 
  onFiltersChange 
}: FilterSortProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sortOptions = [
    { value: 'rating', label: 'Overall Rating' },
    { value: 'fees-low', label: 'Fees Low → High' },
    { value: 'payout-speed', label: 'Payout Speed' },
    { value: 'trust', label: 'Trust Score' },
  ];

  const gameOptions = ['CS2', 'Rust', 'TF2', 'Dota2'];
  const modeOptions = ['Cases', 'Crash', 'Coinflip', 'Roulette', 'Upgrader', 'Contracts'];
  const paymentOptions = ['skins', 'crypto', 'cards'];

  const activeFilterCount = 
    filters.games.length + 
    filters.modes.length + 
    filters.paymentMethods.length +
    (filters.kycRequired !== null ? 1 : 0) +
    (filters.verified ? 1 : 0);

  const handleGameToggle = (game: string) => {
    const newGames = filters.games.includes(game)
      ? filters.games.filter(g => g !== game)
      : [...filters.games, game];
    onFiltersChange({ ...filters, games: newGames });
  };

  const handleModeToggle = (mode: string) => {
    const newModes = filters.modes.includes(mode)
      ? filters.modes.filter(m => m !== mode)
      : [...filters.modes, mode];
    onFiltersChange({ ...filters, modes: newModes });
  };

  const handlePaymentToggle = (payment: string) => {
    const newPayments = filters.paymentMethods.includes(payment)
      ? filters.paymentMethods.filter(p => p !== payment)
      : [...filters.paymentMethods, payment];
    onFiltersChange({ ...filters, paymentMethods: newPayments });
  };

  const clearFilters = () => {
    onFiltersChange({
      games: [],
      modes: [],
      paymentMethods: [],
      kycRequired: null,
      verified: false,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Games */}
      <div>
        <Label className="text-base font-medium mb-3 block">Games</Label>
        <div className="grid grid-cols-2 gap-2">
          {gameOptions.map((game) => (
            <div key={game} className="flex items-center space-x-2">
              <Checkbox 
                id={`game-${game}`}
                checked={filters.games.includes(game)}
                onCheckedChange={() => handleGameToggle(game)}
              />
              <Label htmlFor={`game-${game}`} className="text-sm">{game}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Modes */}
      <div>
        <Label className="text-base font-medium mb-3 block">Modes</Label>
        <div className="grid grid-cols-2 gap-2">
          {modeOptions.map((mode) => (
            <div key={mode} className="flex items-center space-x-2">
              <Checkbox 
                id={`mode-${mode}`}
                checked={filters.modes.includes(mode)}
                onCheckedChange={() => handleModeToggle(mode)}
              />
              <Label htmlFor={`mode-${mode}`} className="text-sm">{mode}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Payment Methods */}
      <div>
        <Label className="text-base font-medium mb-3 block">Payment Methods</Label>
        <div className="space-y-2">
          {paymentOptions.map((payment) => (
            <div key={payment} className="flex items-center space-x-2">
              <Checkbox 
                id={`payment-${payment}`}
                checked={filters.paymentMethods.includes(payment)}
                onCheckedChange={() => handlePaymentToggle(payment)}
              />
              <Label htmlFor={`payment-${payment}`} className="text-sm capitalize">{payment}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Other Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="kyc-required"
            checked={filters.kycRequired === true}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, kycRequired: checked ? true : null })
            }
          />
          <Label htmlFor="kyc-required">KYC Required</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="verified"
            checked={filters.verified}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, verified: !!checked })
            }
          />
          <Label htmlFor="verified">Verified Only</Label>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[160px] justify-between">
              Sort: {sortOptions.find(o => o.value === sortBy)?.label}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(sortBy === option.value && "bg-accent")}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Filters */}
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter operators by your preferences
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden md:flex">
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 p-4">
            <FilterContent />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View Toggle */}
      <div className="flex items-center border rounded-lg">
        <Button
          variant={view === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('grid')}
          className="rounded-r-none"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={view === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('list')}
          className="rounded-l-none"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilterSort;
