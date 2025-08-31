import { useState } from 'react';
import { Search, Globe, Moon, Sun, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    {
      title: 'Skins',
      href: '/skins',
      description: 'Gaming skins hub for all games',
      items: [
        { title: 'All Games', href: '/skins' },
        { title: 'CS2 Cases', href: '/cases' },
        { title: 'Mystery Boxes', href: '/mystery-boxes' },
      ]
    },
    {
      title: 'Operators',
      href: '/operators',
      description: 'Compare CS2 trading platforms',
      items: [
        { title: 'All Operators', href: '/operators' },
        { title: 'Top Rated', href: '/operators/top-rated' },
        { title: 'Low Fees', href: '/operators/low-fees' },
      ]
    },
    {
      title: 'Cases',
      href: '/cases',
      description: 'CS2 case analysis and odds',
      items: [
        { title: 'All Cases', href: '/cases' },
        { title: 'New Releases', href: '/cases/new' },
        { title: 'Best Value', href: '/cases/best-value' },
      ]
    },
    {
      title: 'Mystery Boxes',
      href: '/mystery-boxes',
      description: 'Third-party box openings',
      items: [
        { title: 'All Boxes', href: '/mystery-boxes' },
        { title: 'Verified Only', href: '/mystery-boxes/verified' },
        { title: 'Fair Odds', href: '/mystery-boxes/fair' },
      ]
    },
    {
      title: 'Guides',
      href: '/guides',
      description: 'Trading education and tips',
      items: [
        { title: 'Trading Guides', href: '/guides/trading' },
        { title: 'Security Tips', href: '/guides/security' },
        { title: 'Market Analysis', href: '/guides/analysis' },
      ]
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-semibold">Unpacked.gg</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="h-10">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-card p-6 no-underline outline-none focus:shadow-md"
                            href={item.href}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {item.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {item.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        {item.items?.map((subItem) => (
                          <NavigationMenuLink key={subItem.title} asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href={subItem.href}
                            >
                              <div className="text-sm font-medium leading-none">
                                {subItem.title}
                              </div>
                            </a>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative hidden md:block">
              {searchOpen ? (
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search operators, cases..."
                    className="w-64"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Button variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Language */}
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* How we rate */}
            <Button variant="ghost" size="sm" className="hidden lg:flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>How we rate</span>
            </Button>

            {/* Discord */}
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <div key={item.title} className="space-y-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="pl-4 space-y-1">
                        {item.items?.map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.href}
                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {subItem.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      How we rate
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;