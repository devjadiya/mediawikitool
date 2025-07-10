import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Camera, Upload, Award, BookOpen } from "lucide-react";

const steps = [
  {
    icon: <Camera className="h-8 w-8 text-primary" />,
    title: "1. Capture a Great Photo",
    description: "Find a subject that fits one of the competition categories. Focus on good lighting, clear focus, and compelling composition. Remember, you are capturing science!",
  },
  {
    icon: <Check className="h-8 w-8 text-primary" />,
    title: "2. Check the Rules",
    description: "Ensure your photo is your own work and does not contain watermarks, signatures, or copyrighted material (like posters or art). High-resolution images are preferred.",
  },
   {
    icon: <Upload className="h-8 w-8 text-primary" />,
    title: "3. Upload to Wikimedia Commons",
    description: "Use the official upload wizard for the competition. You can use our AI tools to help generate a good title, description, and categories to make your submission stand out.",
  },
   {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "4. Submit and Win!",
    description: "Once uploaded and properly categorized, your photo is officially in the competition. Keep an eye on the timeline for winner announcements.",
  },
];

const bestPractices = [
    { title: "Tell a Story", description: "A great science photo doesn't just show something; it tells a story or explains a concept." },
    { title: "Metadata is Key", description: "Provide as much information as you can. What is it? How was it taken? This context is invaluable for education." },
    { title: "Focus on Quality", description: "Sharp focus, good exposure, and minimal distracting elements will make your photo more useful and impactful." },
    { title: "No Watermarks", description: "Submissions must be free of any watermarks, logos, or text overlays to be eligible." },
];

export default function ContributionGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12" id="contribution-guide">
       <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-5) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 text-green-400 rounded-full mb-4 ring-2 ring-green-500/20">
            <BookOpen className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">How to Contribute</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Follow these steps and best practices to submit your photos to Wiki Loves Science.
        </p>
      </header>
      
      <section>
        <h2 className="text-3xl font-headline font-bold mb-8 text-center">Step-by-Step Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="bg-secondary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                 <div className="p-3 bg-background rounded-full">
                    {step.icon}
                 </div>
                 <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-bold mb-8 text-center">Best Practices</h2>
        <div className="space-y-4">
            {bestPractices.map((practice, index) => (
                 <Card key={index} className="bg-card/50">
                    <CardContent className="p-4 flex items-center gap-4">
                         <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                         <div>
                            <h4 className="font-semibold">{practice.title}</h4>
                            <p className="text-sm text-muted-foreground">{practice.description}</p>
                         </div>
                    </CardContent>
                 </Card>
            ))}
        </div>
      </section>
    </div>
  );
}

    