import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock } from 'lucide-react';

export default function MovieLoading() {
  return (
    <div className="space-y-8">
      <div className="relative h-[30vh] md:h-[50vh] w-full">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-[15vh] md:-mt-[20vh] relative z-10 space-y-8">
        <div className="md:flex md:items-end md:space-x-8">
            <div className="w-48 md:w-64 flex-shrink-0">
                <Skeleton className="w-full h-[300px] md:h-[384px] rounded-lg" />
            </div>
            <div className="mt-4 md:mt-0 space-y-4">
                 <Skeleton className="h-12 w-96" />
                 <Skeleton className="h-6 w-24" />
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent" />
                        <Skeleton className="h-6 w-28" />
                    </div>
                    <div className="flex items-center gap-2">
                         <Clock className="w-5 h-5 text-accent" />
                         <Skeleton className="h-6 w-20" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                     <Skeleton className="h-8 w-20 rounded-full" />
                     <Skeleton className="h-8 w-24 rounded-full" />
                     <Skeleton className="h-8 w-16 rounded-full" />
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            <div className="lg:col-span-2 space-y-8">
                 <div>
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-5/6" />
                </div>

                <div>
                    <Skeleton className="h-8 w-48 mb-4" />
                    <div className="aspect-video w-full rounded-lg">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>
            </div>
            <aside className="space-y-6">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
}
