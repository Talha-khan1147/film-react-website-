import React from 'react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { Platform } from 'react-native';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import {
  ChatListScreen,
  ChatScreen,
  StoriesScreen,
  SearchScreen,
  ProfileScreen,
  NotificationsScreen,
  SettingsScreen,
  NotFoundScreen,
  LoginScreen,
  SetupProfileScreen,
} from './pages';
import { useAuth } from './hooks/useAuth';
import { SplashScreen } from './components/common/SplashScreen';
import { ROUTES } from './constants/routes';

const Router = Platform.OS === 'web' ? BrowserRouter : MemoryRouter;

function AppNavigation() {
  const { isLoading } = useAuth();
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen
          isLoading={isLoading}
          minDuration={2000}
          onFinish={() => setShowSplash(false)}
        />
      )}
      <Router
        {...(Platform.OS === 'web'
          ? { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
          : {})}
      >
        <AppLayout>
          <Routes>
              {/* Public Auth Routes */}
              <Route
                path={ROUTES.LOGIN}
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginScreen />
                  </ProtectedRoute>
                }
              />

              {/* Onboarding / Profile Setup Route */}
              <Route
                path={ROUTES.SETUP_PROFILE}
                element={
                  <ProtectedRoute requireAuth={true} allowIncompleteProfile={true}>
                    <SetupProfileScreen />
                  </ProtectedRoute>
                }
              />

              {/* Protected App Routes */}
              <Route
                path={ROUTES.HOME}
                element={
                  <ProtectedRoute>
                    <ChatListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.CHAT_DETAILS}
                element={
                  <ProtectedRoute>
                    <ChatScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.STORIES}
                element={
                  <ProtectedRoute>
                    <StoriesScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SEARCH}
                element={
                  <ProtectedRoute>
                    <SearchScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.NOTIFICATIONS}
                element={
                  <ProtectedRoute>
                    <NotificationsScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SETTINGS}
                element={
                  <ProtectedRoute>
                    <SettingsScreen />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </AppLayout>
        </Router>
      </>
    );
  }

  export function App() {
    return (
      <ThemeProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  export default App;
