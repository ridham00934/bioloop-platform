import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
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

const AppShell = lazy(() => import("./components/BioLoopShell.tsx"));
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


function ProtectedRoute({ path, redirectAfterAuth, children }: {
  path: string;
  redirectAfterAuth?: string;
  children: React.ReactNode;
}) {
  return (
    <Route
      path={path}
      element={
        <RequireAuth redirectAfterAuth={redirectAfterAuth ?? "/auth"}>
          <AppShell>{children}</AppShell>
        </RequireAuth>
      }
    />
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
                element={<AuthPage redirectAfterAuth="/dashboard" />}
              />

              {/* Public listing detail */}
              <Route
                path="/listings/:id"
                element={<ListingDetails />}
              />

              {/* Protected */}
              <ProtectedRoute path="/dashboard" redirectAfterAuth="/dashboard">
                <Dashboard />
              </ProtectedRoute>
              <ProtectedRoute path="/listings">
                <MyListings />
              </ProtectedRoute>
              <ProtectedRoute path="/listings/new">
                <CreateListing />
              </ProtectedRoute>
              <ProtectedRoute path="/listings/:id/edit">
                <EditListing />
              </ProtectedRoute>
              <ProtectedRoute path="/marketplace/listings">
                <MarketplaceListings />
              </ProtectedRoute>
              <ProtectedRoute path="/rfqs">
                <RFQs />
              </ProtectedRoute>
              <ProtectedRoute path="/rfqs/new">
                <CreateRFQ />
              </ProtectedRoute>
              <ProtectedRoute path="/quotes">
                <Quotes />
              </ProtectedRoute>
              <ProtectedRoute path="/quotes/:id">
                <QuoteDetails />
              </ProtectedRoute>
              <ProtectedRoute path="/orders">
                <Orders />
              </ProtectedRoute>
              <ProtectedRoute path="/orders/:id">
                <OrderDetails />
              </ProtectedRoute>
              <ProtectedRoute path="/shipments">
                <Shipments />
              </ProtectedRoute>
              <ProtectedRoute path="/messages">
                <Messages />
              </ProtectedRoute>
              <ProtectedRoute path="/saved-materials">
                <SavedMaterials />
              </ProtectedRoute>
              <ProtectedRoute path="/passports">
                <BioPassports />
              </ProtectedRoute>
              <ProtectedRoute path="/passports/:id">
                <BioPassportPage />
              </ProtectedRoute>
              <ProtectedRoute path="/biovalue-calculator">
                <BioValueCalculator />
              </ProtectedRoute>
              <ProtectedRoute path="/smart-matcher">
                <SmartMatcherPage />
              </ProtectedRoute>
              <ProtectedRoute path="/bioroute">
                <BioRoutePage />
              </ProtectedRoute>
              <ProtectedRoute path="/impact-ledger">
                <ImpactLedger />
              </ProtectedRoute>
              <ProtectedRoute path="/notifications">
                <NotificationsPage />
              </ProtectedRoute>
              <ProtectedRoute path="/settings/profile">
                <SettingsProfile />
              </ProtectedRoute>
              <ProtectedRoute path="/settings/organisation">
                <SettingsOrganisation />
              </ProtectedRoute>
              <ProtectedRoute path="/ai-assistant">
                <AIAssistantPage />
              </ProtectedRoute>

              {/* Admin */}
              <ProtectedRoute path="/admin">
                <AdminOverview />
              </ProtectedRoute>
              <ProtectedRoute path="/admin/verification">
                <AdminVerification />
              </ProtectedRoute>
              <ProtectedRoute path="/admin/users">
                <AdminUsers />
              </ProtectedRoute>
              <ProtectedRoute path="/admin/taxonomy">
                <AdminTaxonomy />
              </ProtectedRoute>
              <ProtectedRoute path="/admin/disputes">
                <AdminDisputes />
              </ProtectedRoute>
              <ProtectedRoute path="/admin/audit">
                <AdminAudit />
              </ProtectedRoute>
              <ProtectedRoute path="/admin/integrations">
                <AdminIntegrations />
              </ProtectedRoute>
              <ProtectedRoute path="/admin/data-quality">
                <AdminDataQuality />
              </ProtectedRoute>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
