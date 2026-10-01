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
} from './pages';
import { ROUTES } from './constants/routes';

const Router = Platform.OS === 'web' ? BrowserRouter : MemoryRouter;

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
