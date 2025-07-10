
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const teamMembers = [
    {
        name: 'Dev Jadiya',
        role: 'Lead Developer & Project Maintainer',
        avatar: 'https://avatars.githubusercontent.com/u/81258656?v=4',
        social: {
            github: 'https://github.com/devjadiya',
            linkedin: 'https://www.linkedin.com/in/dev-jadiya-9922a5214/',
            twitter: 'https://x.com/dev_jadiya',
        },
    }
];

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">Contact Us</h1>
        <p className="text-xl text-muted-foreground">Get in touch with the team behind the WLS India Archive.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>For general inquiries, partnerships, or feedback, please reach out to us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <a href="mailto:contact@wlsindia.org" className="hover:underline">contact@wlsindia.org</a>
                 </div>
                 <div className="flex items-center gap-4">
                    <Twitter className="h-6 w-6 text-primary" />
                    <a href="https://twitter.com/WLS_India" target="_blank" rel="noopener noreferrer" className="hover:underline">@WLS_India</a>
                 </div>
            </CardContent>
        </Card>
        <Card>
             <CardHeader>
                <CardTitle>Our Team</CardTitle>
                <CardDescription>The core contributors to this project.</CardDescription>
            </CardHeader>
             <CardContent>
                {teamMembers.map(member => (
                    <div key={member.name} className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <div className="flex gap-2 mt-1">
                                <Link href={member.social.github} target="_blank"><Button variant="ghost" size="icon"><Github className="h-4 w-4"/></Button></Link>
                                <Link href={member.social.linkedin} target="_blank"><Button variant="ghost" size="icon"><Linkedin className="h-4 w-4"/></Button></Link>
                                <Link href={member.social.twitter} target="_blank"><Button variant="ghost" size="icon"><Twitter className="h-4 w-4"/></Button></Link>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
