import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teamMembers } from '@/lib/data';
import { Mail, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="container mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold text-primary mb-2">Contact & Team</h1>
        <p className="text-xl text-muted-foreground">Meet the people behind WLS India and get in touch.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <p className="text-lg">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you.
              You can reach out to us via email or our social media channels.
            </p>
            <div className="flex flex-col gap-4">
              <a href="mailto:wls-india@example.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-5 w-5" />
                <span>wls-india@example.com</span>
              </a>
              <a href="https://twitter.com/wlsindia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Twitter className="h-5 w-5" />
                <span>@WLSIndia on Twitter</span>
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image 
                src="https://placehold.co/400x300.png"
                alt="A group of volunteers at a Wikimedia event"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
                data-ai-hint="volunteers group photo"
            />
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-4xl font-headline font-bold text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map(member => (
            <Card key={member.id} className="text-center">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{member.name}</p>
                  <p className="text-sm text-accent font-semibold">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
