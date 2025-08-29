import { MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Explore',
      links: [
        { name: 'All Operators', href: '/operators' },
        { name: 'Top Rated', href: '/operators/top-rated' },
        { name: 'Low Fees', href: '/operators/low-fees' },
        { name: 'Best Payouts', href: '/operators/fast-payouts' },
      ]
    },
    {
      title: 'Reviews',
      links: [
        { name: 'Operator Reviews', href: '/reviews/operators' },
        { name: 'Case Reviews', href: '/reviews/cases' },
        { name: 'Community Reviews', href: '/reviews/community' },
        { name: 'Submit Review', href: '/reviews/submit' },
      ]
    },
    {
      title: 'Cases & Boxes',
      links: [
        { name: 'CS2 Cases', href: '/cases' },
        { name: 'Mystery Boxes', href: '/mystery-boxes' },
        { name: 'New Releases', href: '/cases/new' },
        { name: 'Best Odds', href: '/cases/fair-odds' },
      ]
    },
    {
      title: 'Guides',
      links: [
        { name: 'Trading Guides', href: '/guides/trading' },
        { name: 'Security Tips', href: '/guides/security' },
        { name: 'Market Analysis', href: '/guides/analysis' },
        { name: 'Beginner Guide', href: '/guides/beginners' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Editorial Policy', href: '/editorial-policy' },
        { name: 'How We Rate', href: '/methodology' },
        { name: 'Contact', href: '/contact' },
      ]
    }
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-lg font-semibold">Unpacked.gg</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Trusted CS2 skins trading analysis with community-driven reviews 
              and transparent methodology.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Stay Updated</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Email address" 
                  className="text-sm"
                  type="email"
                />
                <Button size="sm" className="flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="font-medium text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Legal & Copyright */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
            <p>© {currentYear} Unpacked.gg. All rights reserved.</p>
            <div className="flex flex-wrap items-center space-x-4">
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Social & Discord */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Discord
            </Button>
          </div>
        </div>

        {/* Regional Disclaimer */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> Skin trading involves financial risk. 
            Always verify operator legitimacy and read terms before depositing. 
            Some operators may not be available in your jurisdiction. 
            We may earn commissions from tracked referrals at no cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;