import WelcomeScreen from '@/components/WelcomeScreen';
import { DarkMode } from '@/components/Darkmode';

export default function Home() {
  return (
    <main className="relative">
      {/* <DarkMode /> */}
      <WelcomeScreen />
    </main>
  );
}