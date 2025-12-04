import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, WifiOff, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOffline } = useApp();
  const { t, i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = event.target.value;
    i18n.changeLanguage(lng); // Change the language
    localStorage.setItem("language", lng); // Save the preference
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Report a Case", path: "/report" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Volunteers", path: "/volunteer" },
    { label: "Long Term Support", path: "/support" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-medium text-center flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>{t("You are currently offline. Reports will be saved locally and synced when you reconnect.")}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span className="text-xl font-heading font-bold tracking-tight text-foreground">
                ReliefBridge
              </span>
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location === item.path
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Language Selector Dropdown */}
          <select
            onChange={changeLanguage}
            defaultValue={i18n.language}
            className="ml-4 p-2 border rounded text-sm"
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
            <option value="ta">தமிழ்</option>
          </select>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-4 shadow-lg">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "text-base font-medium py-2 border-b border-border/50 last:border-0",
                    location === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome and Description */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t("welcome")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-12 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-white">
                <AlertCircle className="h-3 w-3" />
              </div>
              <span className="text-lg font-heading font-bold">ReliefBridge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A community-driven platform for disaster relief coordination. Open, transparent, and dedicated to helping Sri Lanka recover.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Emergency</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Police: 119</li>
              <li>Ambulance: 1990</li>
              <li>Disaster Management: 117</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/report">Report a Case</Link></li>
              <li><Link href="/volunteer">Volunteer Registry</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>Transparency Report</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ReliefBridge. Built for humanity.
        </div>
      </footer>
    </div>
  );
}
