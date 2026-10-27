import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireAdmin } from "@/components/RequireAdmin";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { useContext, useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Marketplace = lazy(() => import("./pages/Marketplace.tsx"));
const HowItWorks = lazy(() => import("./pages/HowItWorks.tsx"));
const MaterialLibrary = lazy(() => import("./pages/MaterialLibrary.tsx"));
const ImpactMethodology = lazy(() => import("./pages/ImpactMethodology.tsx"));
const AboutBioLoop = lazy(() => import("./pages/AboutBioLoop.tsx"));
const ContactBioLoop = lazy(() => import("./pages/ContactBioLoop.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const SignInPage = lazy(() => import("./pages/SignInPage.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const AppShell = lazy(() => import("./components/BioLoopShell").then((m) => ({ default: m.BioLoopShell })));
const MarketplaceListings = lazy(() => import("./pages/MarketplaceListings.tsx"));
const ListingDetails = lazy(() => import("./pages/ListingDetails.tsx"));
const MyListings = lazy(() => import("./pages/MyListings.tsx"));
const CreateListing = lazy(() => import("./pages/CreateListing.tsx"));
const EditListing = lazy(() => import("./pages/EditListing.tsx"));
const RFQs = lazy(() => import("./pages/RFQs.tsx"));
const CreateRFQ = lazy(() => import("./pages/CreateRFQ.tsx"));
const Quotes = lazy(() => import("./pages/Quotes.tsx"));
const QuoteDetails = lazy(() => import("./pages/QuoteDetails.tsx"));
const Orders = lazy(() => import("./pages/Orders.tsx"));
const OrderDetails = lazy(() => import("./pages/OrderDetails.tsx"));
const Shipments = lazy(() => import("./pages/Shipments.tsx"));
const Messages = lazy(() => import("./pages/Messages.tsx"));
const SavedMaterials = lazy(() => import("./pages/SavedMaterials.tsx"));
const BioPassports = lazy(() => import("./pages/BioPassports.tsx"));
const BioValueCalculator = lazy(() => import("./pages/BioValueCalculator.tsx"));
const BioPassportPage = lazy(() => import("./pages/BioPassportPage.tsx"));
const SmartMatcherPage = lazy(() => import("./pages/SmartMatcherPage.tsx"));
const BioRoutePage = lazy(() => import("./pages/BioRoutePage.tsx"));
const ImpactLedger = lazy(() => import("./pages/ImpactLedger.tsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.tsx"));
const SettingsProfile = lazy(() => import("./pages/SettingsProfile.tsx"));
const SettingsOrganisation = lazy(() => import("./pages/SettingsOrganisation.tsx"));
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage.tsx"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview.tsx"));
const AdminVerification = lazy(() => import("./pages/admin/AdminVerification.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));
const AdminTaxonomy = lazy(() => import("./pages/admin/AdminTaxonomy.tsx"));
const AdminDisputes = lazy(() => import("./pages/admin/AdminDisputes.tsx"));
const AdminAudit = lazy(() => import("./pages/admin/AdminAudit.tsx"));
const AdminIntegrations = lazy(() => import("./pages/admin/AdminIntegrations.tsx"));
const AdminDataQuality = lazy(() => import("./pages/admin/AdminDataQuality.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in the browser runtime). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[Preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


function ProtectedRouteEl({ children, redirectImmediately = false }: { children?: React.ReactNode; redirectImmediately?: boolean }) {
  // Plain wrapper component — NOT a <Route>. React Router v6 only allows
  // <Route> (or <React.Fragment>) as a direct child of <Routes>, so this
  // component must never return a <Route>.
  if (!children) {
    throw new Error("ProtectedRouteEl requires children");
  }

  // Keep behavior consistent with the original redirect-immediately intent:
  // if the route wants an immediate bounce to /login when unauthenticated, honor
  // that; otherwise fall back to RequireAuth's blocked screen for better UX.
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (redirectImmediately) {
      return <Navigate to="/login" replace />;
    }

    // Show RequireAuth's own blocked screen instead of silently redirecting.
    return (
      <AppShell>
        <RequireAuth>{children}</RequireAuth>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <RequireAuth>{children}</RequireAuth>
    </AppShell>
  );
}



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/material-library" element={<MaterialLibrary />} />
              <Route path="/impact-methodology" element={<ImpactMethodology />} />
              <Route path="/about" element={<AboutBioLoop />} />
              <Route path="/contact" element={<ContactBioLoop />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />

              {/* Auth */}
              <Route
                path="/auth"
                element={<AuthPage />}
              />

              {/* Public listing detail */}
              <Route
                path="/listings/:id"
                element={<ListingDetails />}
              />

              {/* Protected */}
              <Route
                path="/dashboard"
                element={<ProtectedRouteEl><Dashboard /></ProtectedRouteEl>}
              />
              <Route path="/listings" element={<ProtectedRouteEl><MyListings /></ProtectedRouteEl>} />
              <Route path="/listings/new" element={<ProtectedRouteEl><CreateListing /></ProtectedRouteEl>} />
              <Route path="/listings/:id/edit" element={<ProtectedRouteEl><EditListing /></ProtectedRouteEl>} />
              <Route path="/marketplace/listings" element={<ProtectedRouteEl><MarketplaceListings /></ProtectedRouteEl>} />
              <Route path="/rfqs" element={<ProtectedRouteEl><RFQs /></ProtectedRouteEl>} />
              <Route path="/rfqs/new" element={<ProtectedRouteEl><CreateRFQ /></ProtectedRouteEl>} />
              <Route path="/quotes" element={<ProtectedRouteEl><Quotes /></ProtectedRouteEl>} />
              <Route path="/quotes/:id" element={<ProtectedRouteEl><QuoteDetails /></ProtectedRouteEl>} />
              <Route path="/orders" element={<ProtectedRouteEl><Orders /></ProtectedRouteEl>} />
              <Route path="/orders/:id" element={<ProtectedRouteEl><OrderDetails /></ProtectedRouteEl>} />
              <Route path="/shipments" element={<ProtectedRouteEl><Shipments /></ProtectedRouteEl>} />
              <Route path="/messages" element={<ProtectedRouteEl><Messages /></ProtectedRouteEl>} />
              <Route path="/saved-materials" element={<ProtectedRouteEl><SavedMaterials /></ProtectedRouteEl>} />
              <Route path="/passports" element={<ProtectedRouteEl><BioPassports /></ProtectedRouteEl>} />
              <Route path="/passports/:id" element={<ProtectedRouteEl><BioPassportPage /></ProtectedRouteEl>} />
              <Route path="/biovalue-calculator" element={<ProtectedRouteEl><BioValueCalculator /></ProtectedRouteEl>} />
              <Route path="/smart-matcher" element={<ProtectedRouteEl><SmartMatcherPage /></ProtectedRouteEl>} />
              <Route path="/bioroute" element={<ProtectedRouteEl><BioRoutePage /></ProtectedRouteEl>} />
              <Route path="/impact-ledger" element={<ProtectedRouteEl><ImpactLedger /></ProtectedRouteEl>} />
              <Route path="/notifications" element={<ProtectedRouteEl><NotificationsPage /></ProtectedRouteEl>} />
              <Route path="/settings/profile" element={<ProtectedRouteEl><SettingsProfile /></ProtectedRouteEl>} />
              <Route path="/settings/organisation" element={<ProtectedRouteEl><SettingsOrganisation /></ProtectedRouteEl>} />
              <Route path="/ai-assistant" element={<ProtectedRouteEl><AIAssistantPage /></ProtectedRouteEl>} />

              {/* Admin */}
              <Route
                path="/admin"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminOverview /></RequireAdmin></ProtectedRouteEl>}
              />
              <Route
                path="/admin/verification"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminVerification /></RequireAdmin></ProtectedRouteEl>}
              />
              <Route
                path="/admin/users"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminUsers /></RequireAdmin></ProtectedRouteEl>}
              />
              <Route
                path="/admin/taxonomy"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminTaxonomy /></RequireAdmin></ProtectedRouteEl>}
              />
              <Route
                path="/admin/disputes"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminDisputes /></RequireAdmin></ProtectedRouteEl>}
              />
              <Route
                path="/admin/audit"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminAudit /></RequireAdmin></ProtectedRouteEl>}
              />
              <Route
                path="/admin/integrations"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminIntegrations /></RequireAdmin></ProtectedRouteEl>}
              />
              <Route
                path="/admin/data-quality"
                element={<ProtectedRouteEl redirectImmediately><RequireAdmin><AdminDataQuality /></RequireAdmin></ProtectedRouteEl>}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
