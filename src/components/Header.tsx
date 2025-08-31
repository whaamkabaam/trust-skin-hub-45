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
      title: 'Skin Cases',
      href: '/skin-cases',
      description: 'Best skin case opening sites',
      items: [
        { title: 'CS2', href: '/skin-cases/cs2' },
        { title: 'Dota2', href: '/skin-cases/dota2' },
        { title: 'Rust', href: '/skin-cases/rust' },
        { title: 'Team Fortress 2', href: '/skin-cases/tf2' },
        { title: 'New Skin Operators', href: '/skin-cases/new' },
        { title: 'Promo Codes', href: '/skin-cases/promo-codes' },
        { title: 'Best Case Opening Sites', href: '/skin-cases/best' },
        { title: 'Best Skin Trading Sites', href: '/skin-cases/trading' },
      ]
    },
    {
      title: 'Mystery Boxes',
      href: '/mystery-boxes',
      description: 'Mystery box opening platforms',
      items: [
        { title: 'Best Sites', href: '/mystery-boxes/best' },
        { title: 'New Sites', href: '/mystery-boxes/new' },
        { title: 'Promo Codes', href: '/mystery-boxes/promo-codes' },
        { title: 'Tech', href: '/mystery-boxes/tech' },
        { title: 'Jewelry', href: '/mystery-boxes/jewelry' },
        { title: 'Cars', href: '/mystery-boxes/cars' },
        { title: 'Lego', href: '/mystery-boxes/lego' },
        { title: 'Collectibles', href: '/mystery-boxes/collectibles' },
      ]
    },
    {
      title: 'eSports Betting',
      href: '/esports-betting',
      description: 'Best eSports betting platforms',
      items: [
        { title: 'Best Sites', href: '/esports-betting/best' },
        { title: 'New Sites', href: '/esports-betting/new' },
        { title: 'Promo Codes', href: '/esports-betting/promo-codes' },
        { title: 'Welcome Bonuses', href: '/esports-betting/welcome-bonuses' },
        { title: 'Free Bonuses', href: '/esports-betting/free-bonuses' },
        { title: 'CS2 Match Betting Sites', href: '/esports-betting/cs2' },
      ]
    },
    {
      title: 'Casinos',
      href: '/casinos',
      description: 'Top online casino platforms',
      items: [
        { title: 'Best Casinos', href: '/casinos/best' },
        { title: 'New Casinos', href: '/casinos/new' },
        { title: 'Casino Bonuses', href: '/casinos/bonuses' },
        { title: 'Crypto Casinos', href: '/casinos/crypto' },
        { title: 'Bitcoin Casinos', href: '/casinos/bitcoin' },
        { title: 'Slots Casinos', href: '/casinos/slots' },
        { title: 'Plinko Casinos', href: '/casinos/plinko' },
        { title: 'Crash Casinos', href: '/casinos/crash' },
      ]
    },
    {
      title: 'Reviews',
      href: '/reviews',
      description: 'Platform reviews and ratings',
      items: [
        { 
          title: 'Skin Case Opening',
          href: '/reviews/case-opening',
          subcategories: [
            { title: 'Hellcase', href: '/reviews/case-opening/hellcase' },
            { title: 'CSGORoll', href: '/reviews/case-opening/csgoroll' },
            { title: 'CSGOEmpire', href: '/reviews/case-opening/csgoempire' },
            { title: 'RustyPot', href: '/reviews/case-opening/rustypot' },
            { title: 'RustClash', href: '/reviews/case-opening/rustclash' },
            { title: 'Clash.gg', href: '/reviews/case-opening/clash-gg' },
          ]
        },
        { 
          title: 'Mystery Box Sites',
          href: '/reviews/mystery-box',
          subcategories: [
            { title: 'Hypedrop Review', href: '/reviews/mystery-box/hypedrop' },
            { title: 'Cases.gg', href: '/reviews/mystery-box/cases-gg' },
            { title: 'Boxed.gg', href: '/reviews/mystery-box/boxed-gg' },
            { title: 'Supabox', href: '/reviews/mystery-box/supabox' },
            { title: 'Rillabox', href: '/reviews/mystery-box/rillabox' },
            { title: 'LuxDrop', href: '/reviews/mystery-box/luxdrop' },
          ]
        },
        { 
          title: 'eSports Betting Sites',
          href: '/reviews/esports-betting',
          subcategories: [
            { title: 'Gamdom', href: '/reviews/esports-betting/gamdom' },
            { title: 'DuelBits', href: '/reviews/esports-betting/duelbits' },
            { title: 'BC.GAME', href: '/reviews/esports-betting/bc-game' },
            { title: 'Stake Casino', href: '/reviews/esports-betting/stake-casino' },
          ]
        },
        { 
          title: 'Casino Sites',
          href: '/reviews/casinos',
          subcategories: [
            { title: 'Stake Casino Review', href: '/reviews/casinos/stake-casino' },
            { title: 'Gamdom Casino Review', href: '/reviews/casinos/gamdom-casino' },
            { title: 'BC.GAME Casino Review', href: '/reviews/casinos/bc-game-casino' },
            { title: 'Betti Casino Review', href: '/reviews/casinos/betti-casino' },
            { title: 'BitKingz Casino Review', href: '/reviews/casinos/bitkingz-casino' },
            { title: 'BitStarz Casino Review', href: '/reviews/casinos/bitstarz-casino' },
          ]
        },
      ]
    },
    {
      title: 'Guides Blog',
      href: '/guides',
      description: 'Gaming and trading guides',
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
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="h-10">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        {item.title === 'Reviews' ? (
                          <div className="grid w-[600px] gap-3 p-4">
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
                            <div className="grid grid-cols-2 gap-4">
                              {item.items?.map((subItem) => (
                                <div key={subItem.title} className="space-y-2">
                                  <NavigationMenuLink asChild>
                                    <a
                                      href={subItem.href}
                                      className="block select-none rounded-md p-2 font-medium text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      {subItem.title}
                                    </a>
                                  </NavigationMenuLink>
                                  {subItem.subcategories && (
                                    <div className="space-y-1 pl-2">
                                      {subItem.subcategories.map((subSubItem) => (
                                        <NavigationMenuLink key={subSubItem.title} asChild>
                                          <a
                                            href={subSubItem.href}
                                            className="block select-none rounded-md p-1 text-xs leading-none no-underline outline-none transition-colors hover:bg-accent/50 hover:text-accent-foreground text-muted-foreground"
                                          >
                                            {subSubItem.title}
                                          </a>
                                        </NavigationMenuLink>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
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
                        )}
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <a
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        href={item.href}
                      >
                        {item.title}
                      </a>
                    </NavigationMenuLink>
                  )}
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
                      {item.items ? (
                        <>
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="pl-4 space-y-1">
                            {item.items?.map((subItem) => (
                              <div key={subItem.title} className="space-y-1">
                                {subItem.subcategories ? (
                                  <>
                                    <div className="font-medium text-sm text-foreground/90">
                                      {subItem.title}
                                    </div>
                                    <div className="pl-3 space-y-1">
                                      {subItem.subcategories.map((subSubItem) => (
                                        <a
                                          key={subSubItem.title}
                                          href={subSubItem.href}
                                          className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                          {subSubItem.title}
                                        </a>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <a
                                    href={subItem.href}
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {subItem.title}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <a
                          href={item.href}
                          className="block font-medium hover:text-foreground/80 transition-colors"
                        >
                          {item.title}
                        </a>
                      )}
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      How we rate
                    </Button>
                    <Button variant="ghost" className="w-full justify-start mt-2" asChild>
                      <a href="/style-guide">
                        📚 Style Guide
                      </a>
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