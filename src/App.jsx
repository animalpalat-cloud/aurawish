import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { PublicLayout } from './layouts/PublicLayout';

// Core Studio Pages
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';
import EditorPage from './pages/EditorPage';
import DashboardPage from './pages/DashboardPage';
import CardViewPage from './pages/CardViewPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// Trust & Legal Pages
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import DisclaimerPage from './pages/DisclaimerPage';

// Content Hubs & Detail Pages
import BirthdayWishesHubPage from './pages/BirthdayWishesHubPage';
import BirthdayWishesDetailPage from './pages/BirthdayWishesDetailPage';
import BirthdayIdeasHubPage from './pages/BirthdayIdeasHubPage';
import BirthdayArticlePage from './pages/BirthdayArticlePage';
import CardMakerLandingPage from './pages/CardMakerLandingPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Main App Layout Routes (with studio Navbar & Footer) */}
            <Route element={<MainLayout />}>
              {/* Homepage */}
              <Route path="/" element={<HomePage />} />

              {/* Template Hubs & Aliases */}
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/birthday-card-templates" element={<TemplatesPage />} />
              <Route path="/birthday-card-templates/:category" element={<TemplatesPage />} />

              {/* Editor & Creation Flows */}
              <Route path="/create" element={<Navigate to="/create/velvet-luxury" replace />} />
              <Route
                path="/create/:templateId"
                element={
                  <ProtectedRoute>
                    <EditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Trust & Legal Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />

              {/* Birthday Wishes Hub & Relationship / Style Pages */}
              <Route path="/birthday-wishes" element={<BirthdayWishesHubPage />} />

              {/* Explicit SEO Relationship Routes */}
              <Route path="/birthday-wishes-for-mom" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-mom" />} />
              <Route path="/birthday-wishes-for-dad" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-dad" />} />
              <Route path="/birthday-wishes-for-sister" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-sister" />} />
              <Route path="/birthday-wishes-for-brother" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-brother" />} />
              <Route path="/birthday-wishes-for-best-friend" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-best-friend" />} />
              <Route path="/birthday-wishes-for-wife" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-wife" />} />
              <Route path="/birthday-wishes-for-husband" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-husband" />} />
              <Route path="/birthday-wishes-for-girlfriend" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-girlfriend" />} />
              <Route path="/birthday-wishes-for-boyfriend" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-boyfriend" />} />
              <Route path="/birthday-wishes-for-daughter" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-daughter" />} />
              <Route path="/birthday-wishes-for-son" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-son" />} />
              <Route path="/birthday-wishes-for-family" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-family" />} />
              <Route path="/birthday-wishes-for-colleagues" element={<BirthdayWishesDetailPage explicitSlug="birthday-wishes-for-colleagues" />} />

              {/* Explicit SEO Style Routes */}
              <Route path="/funny-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="funny-birthday-wishes" />} />
              <Route path="/romantic-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="romantic-birthday-wishes" />} />
              <Route path="/heartfelt-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="heartfelt-birthday-wishes" />} />
              <Route path="/emotional-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="emotional-birthday-wishes" />} />
              <Route path="/short-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="short-birthday-wishes" />} />
              <Route path="/sweet-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="sweet-birthday-wishes" />} />
              <Route path="/inspirational-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="inspirational-birthday-wishes" />} />
              <Route path="/beautiful-birthday-wishes" element={<BirthdayWishesDetailPage explicitSlug="beautiful-birthday-wishes" />} />

              {/* Product Feature Landing Pages */}
              <Route path="/birthday-card-maker" element={<CardMakerLandingPage explicitSlug="birthday-card-maker" />} />
              <Route path="/online-birthday-card-maker" element={<CardMakerLandingPage explicitSlug="birthday-card-maker" />} />
              <Route path="/create-birthday-card" element={<CardMakerLandingPage explicitSlug="birthday-card-maker" />} />
              <Route path="/personalized-birthday-cards" element={<CardMakerLandingPage explicitSlug="birthday-card-maker" />} />
              <Route path="/digital-birthday-cards" element={<CardMakerLandingPage explicitSlug="digital-birthday-cards" />} />
              <Route path="/animated-birthday-cards" element={<CardMakerLandingPage explicitSlug="animated-birthday-cards" />} />
              <Route path="/birthday-cards-with-photos" element={<CardMakerLandingPage explicitSlug="birthday-cards-with-photos" />} />
              <Route path="/birthday-cards-with-music" element={<CardMakerLandingPage explicitSlug="birthday-cards-with-music" />} />
              <Route path="/shareable-birthday-cards" element={<CardMakerLandingPage explicitSlug="shareable-birthday-cards" />} />

              {/* Birthday Ideas Hub & Article Routes */}
              <Route path="/birthday-ideas" element={<BirthdayIdeasHubPage />} />
              <Route path="/birthday-ideas/:slug" element={<BirthdayArticlePage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Fullscreen Recipient Card Viewing Experience */}
            <Route element={<PublicLayout />}>
              <Route path="/card/:shareId" element={<CardViewPage />} />
              <Route path="/view/:shareId" element={<CardViewPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
