import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppProvider } from "@/lib/AppContext";
import Layout from "@/components/Layout";
import React from "react";
import { useTranslation } from "react-i18next";

// Pages
import Home from "@/pages/Home";
import Report from "@/pages/Report";
import Dashboard from "@/pages/Dashboard";
import Volunteer from "@/pages/Volunteer";
import LongTermSupport from "@/pages/LongTermSupport";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/report" component={Report} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/volunteer" component={Volunteer} />
        <Route path="/support" component={LongTermSupport} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Change the language
    localStorage.setItem("language", lng); // Save the preference
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <div>
            {/* Language Selector */}
            <h1>{t("welcome")}</h1>
            <p>{t("description")}</p>
            <button onClick={() => changeLanguage("en")}>English</button>
            <button onClick={() => changeLanguage("si")}>සිංහල</button>
            <button onClick={() => changeLanguage("ta")}>தமிழ்</button>
          </div>
          {/* Main Router */}
          <Router />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
