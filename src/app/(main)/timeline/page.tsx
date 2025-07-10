import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { timelineEvents } from '@/lib/data';

export default function TimelinePage() {
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">Competition Timeline</h1>
        <p className="text-xl text-muted-foreground">A look back at the journey of the Wiki Science Competition.</p>
      </header>

      <div className="relative pl-6 after:absolute after:inset-y-0 after:left-8 after:w-0.5 after:bg-border">
        {timelineEvents.map((item, index) => (
          <div key={index} className="relative mb-8 pl-12">
            <div className="absolute left-0 top-1 flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary text-primary font-bold text-lg">
              {item.year}
            </div>
            <Card className="ml-4 border-2">
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
