
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ArticleProvider } from './hooks/useArticles';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ArticleProvider>
        <AuthProvider>
          <HashRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/post/:slug" element={<ArticlePage />} />
                    <Route path="/category/:category" element={<HomePage />} />
                    <Route
                      path="/admin/*"
                      element={
                        <AdminLayout>
                          <Routes>
                            <Route path="/" element={<AdminPage />} />
                          </Routes>
                        </AdminLayout>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </AuthProvider>
      </ArticleProvider>
    </ThemeProvider>
  );
};

export default App;
