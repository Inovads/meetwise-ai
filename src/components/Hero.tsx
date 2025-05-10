import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative">
      <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Build something
        </h1>
        <div className="mt-6 max-w-2xl text-lg text-muted-foreground bg-secondary rounded-lg overflow-hidden">
          <div className="p-4 font-mono text-sm space-y-1 text-left">
            <div>This is a base project that uses Supabase as the backend for authentication. This should get you started quickly and save you time and/or AI prompts.</div>
            <br/>
            <div>Source code at <a href="https://github.com/johanntagle/supabase-lovable-project-starter" className="text-blue-500 hover:underline">Github</a>.</div>
            <br/>       
            <div>It was built on the Lovable platform but you can use it without Lovable.</div>
            <div>Uses Supabase as the backend.</div>
            <br/>
            <div>Depending on how good you are at prompting, this should save you at least 10 AI prompts. (It took me almost 30 due to some silly responses from the AI but anyway)</div>
            <br/>
            <div>What works:</div>
            <div className="pl-4">• user sign up and login</div>
            <div className="pl-4">• two roles: user and admin</div>
            <div className="pl-4">• admin management</div>
            <div className="pl-4">• change password while logged on</div>
            <div className="pl-4">• reset forgotten password utility</div>
          </div>
        </div>
      </div>
    </div>
  );
};