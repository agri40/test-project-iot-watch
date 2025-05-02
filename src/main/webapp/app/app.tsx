import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';

import React, { useEffect } from 'react';
import { Card } from 'reactstrap';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Import Redux hooks and actions
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';

// Import application components
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import { ThemeProvider } from 'app/shared/theme/theme-provider';

// Get base href from HTML and remove trailing slash
const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

/**
 * Main App component that serves as the root of the application
 * - Handles authentication and profile loading
 * - Provides theme context
 * - Sets up routing
 * - Renders the main application layout
 */
export const App = () => {
  const dispatch = useAppDispatch();

  // Load session and application profile when component mounts
  useEffect(() => {
    dispatch(getSession()); // Check if user is authenticated
    dispatch(getProfile()); // Load application profile
  }, []);

  // Get various state values from Redux store
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => 
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN])
  );
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  // Style for main container to account for fixed header
  const paddingTop = '60px';

  return (
    <ThemeProvider defaultTheme="system">
      {/* Set up application routing */}
      <BrowserRouter basename={baseHref}>
        <div className="app-container" style={{ paddingTop }}>
          {/* Toast notifications container */}
          <ToastContainer 
            position="top-left" 
            className="toastify-container" 
            toastClassName="toastify-toast" 
          />

          {/* Error boundary wraps header to prevent crashes from breaking entire app */}
          <ErrorBoundary>
            <Header
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              currentLocale={currentLocale}
              ribbonEnv={ribbonEnv}
              isInProduction={isInProduction}
              isOpenAPIEnabled={isOpenAPIEnabled}
            />
          </ErrorBoundary>

          {/* Main content area */}
          <div className="container-fluid view-container" id="app-view-container">
            {/* Main content card */}
            <Card className="jh-card">
              {/* Error boundary wraps routes to prevent crashes from breaking entire app */}
              <ErrorBoundary>
                <AppRoutes /> {/* All application routes */}
              </ErrorBoundary>
            </Card>

            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;