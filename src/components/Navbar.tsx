import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Shield, LogOut, Key } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const [session, setSession] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session:", session);
      
      setSession(!!session);
      
      if (session) {
        // Check admin status
        const { data: hasAdminRole } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          role: 'admin'
        });
        setIsAdmin(!!hasAdminRole);

        // Fetch user profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        
        console.log("Profile data:", profile);
        console.log("Profile error:", error);
        
        if (profile?.full_name) {
          console.log("Setting full name:", profile.full_name);
          setFullName(profile.full_name);
        } else {
          // Fallback to metadata if profile fetch fails
          const fullNameFromMeta = session.user.user_metadata?.full_name;
          console.log("Falling back to metadata full name:", fullNameFromMeta);
          if (fullNameFromMeta) {
            setFullName(fullNameFromMeta);
          }
        }
      }
    };

    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      if (!session) {
        setFullName("");
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="#features" className="nav-link">
              Your
            </a>
            <a href="#features" className="nav-link">
              Menu
            </a>
            <a href="#about" className="nav-link">
              Goes
            </a>
            <a href="#contact" className="nav-link">
              Here
            </a>
            {isAdmin && (
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => navigate("/admin")}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium">
                    {fullName || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <ChangePasswordForm />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => navigate("/auth")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};