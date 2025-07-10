import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { timelineEvents } from '@/lib/data';

export default function TimelinePage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-headline font-bold text-primary mb-2">Competition Timeline</h1>
        <p className="text-xl text-muted-foreground">A look back at the journey of WLS in India.</p>
      </header>

      <div className="relative pl-6 after:absolute after:inset-y-0 after:left-6 after:w-0.5 after:bg-primary/20">
        {timelineEvents.map((item, index) => (
          <div key={index} className="relative mb-8 pl-8">
            <div className="absolute left-[-1.6rem] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary text-primary font-bold">
              {item.year}
            </div>
            <Card className="ml-4">
              <CardHeader>
                <CardTitle className="font-headline">{item.event}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
