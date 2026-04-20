import { CurriculumPreview } from "@/components/sections/CurriculumPreview";
import { Empathy } from "@/components/sections/Empathy";
import { FAQ } from "@/components/sections/FAQ";
import { Features } from "@/components/sections/Features";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { GrowthStory } from "@/components/sections/GrowthStory";
import { Hero } from "@/components/sections/Hero";
import { LessonSample } from "@/components/sections/LessonSample";
import { Philosophy } from "@/components/sections/Philosophy";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Empathy />
      <Philosophy />
      <CurriculumPreview />
      <LessonSample />
      <Features />
      <GrowthStory />
      <FAQ />
      <FinalCTA />
    </>
  );
}
