import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LinkedinIcon, Globe, Award, BookOpen, Shield, TrendingUp } from 'lucide-react';

const ExpertTeam = () => {
  const experts = [
    {
      name: "Alex Chen",
      role: "Lead Data Analyst & Content Manager",
      image: "/team/alex-chen.jpg",
      experience: "7 years",
      credentials: "MSc Data Science, CFA",
      specialization: "Statistical Analysis & Fraud Detection",
      background: "Former quantitative analyst at major investment firm. Specializes in identifying statistical anomalies and fraudulent betting patterns.",
      articles: 247,
      linkedin: "#",
      achievements: [
        "Uncovered 15+ rigged mystery box operations",
        "Published methodology used by industry watchdogs",
        "Featured speaker at iGaming conferences"
      ]
    },
    {
      name: "Sarah Rodriguez", 
      role: "Crypto & Blockchain Specialist",
      image: "/team/sarah-rodriguez.jpg",
      experience: "5 years",
      credentials: "PhD Computer Science, CISSP",
      specialization: "Smart Contract Auditing & Provably Fair Systems",
      background: "Blockchain security researcher with expertise in gambling smart contracts and provably fair algorithms.",
      articles: 89,
      linkedin: "#",
      achievements: [
        "Audited 200+ provably fair implementations",
        "Discovered critical vulnerabilities in 8 major platforms",
        "Co-authored industry white paper on RNG verification"
      ]
    },
    {
      name: "Marcus Thompson",
      role: "Community Relations & User Safety",
      image: "/team/marcus-thompson.jpg", 
      experience: "6 years",
      credentials: "BA Psychology, Certified Addiction Counselor",
      specialization: "Responsible Gambling & User Protection",
      background: "Former customer protection officer at major betting company. Advocates for transparent and fair gambling practices.",
      articles: 156,
      linkedin: "#",
      achievements: [
        "Resolved 1,200+ user complaints",
        "Developed industry-standard complaint resolution process",
        "Helped recover $500K+ in disputed winnings"
      ]
    }
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Meet Our Expert Team</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Industry professionals with deep expertise in data analysis, blockchain technology, and user protection.
          Our team doesn't gamble with your trust.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {experts.map((expert, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="text-center pb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-2xl font-bold text-primary">
                  {expert.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <CardTitle className="text-xl">{expert.name}</CardTitle>
              <p className="text-primary font-medium">{expert.role}</p>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  {expert.experience}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {expert.articles} articles
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Credentials</h4>
                <p className="text-sm text-muted-foreground">{expert.credentials}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Specialization</h4>
                <p className="text-sm text-muted-foreground">{expert.specialization}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Background</h4>
                <p className="text-sm text-muted-foreground">{expert.background}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Achievements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {expert.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <TrendingUp className="w-3 h-3 mt-0.5 text-success flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <LinkedinIcon className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Globe className="w-4 h-4 mr-2" />
                  Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Credentials Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Collective Expertise</h3>
            <p className="text-muted-foreground">Combined experience and qualifications of our core team</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">18+</div>
              <div className="text-sm text-muted-foreground">Years Combined Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">492</div>
              <div className="text-sm text-muted-foreground">Research Articles Published</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Platforms Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1,200+</div> 
              <div className="text-sm text-muted-foreground">Cases Resolved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ExpertTeam;