import { MaintenanceTaskFinder } from '@/components/maintenance-task-finder';
import { Wrench } from 'lucide-react';

export default function MaintenanceTaskFinderPage() {
  return (
    <div className="space-y-12" id="maintenance-task-finder">
      <header className="text-center p-8 rounded-lg" style={{ background: 'radial-gradient(circle, hsl(var(--chart-1) / 0.1), transparent 70%)' }}>
        <div className="inline-flex items-center justify-center p-4 bg-teal-500/10 text-teal-400 rounded-full mb-4 ring-2 ring-teal-500/20">
            <Wrench className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold mb-2">Maintenance Task Finder</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find uncategorized or short articles on Hindi Wikipedia to help with maintenance tasks.
        </p>
      </header>
      <div className="max-w-2xl mx-auto">
        <MaintenanceTaskFinder />
      </div>
    </div>
  );
}
