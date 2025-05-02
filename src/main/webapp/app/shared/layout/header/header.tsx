import './header.scss';

import React, { useState } from 'react';
import { Storage, Translate } from 'react-jhipster';
import { Collapse, Nav, Navbar, NavbarToggler, NavItem } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';

import { AccountMenu, AdminMenu, EntitiesMenu, LocaleMenu } from '../menus';
import { Brand, Home } from './header-components';
import { ThemeToggle } from 'app/shared/theme/theme-toggle';

/**
 * Header component props interface
 */
export interface IHeaderProps {
  isAuthenticated: boolean;       // Whether user is logged in
  isAdmin: boolean;               // Whether user has admin privileges
  ribbonEnv: string;              // Environment ribbon text
  isInProduction: boolean;        // Whether app is in production
  isOpenAPIEnabled: boolean;      // Whether OpenAPI is enabled
  currentLocale: string;          // Current language locale
}

/**
 * Application Header Component
 * - Contains navigation, branding, and user controls
 * - Responsive design with collapsible menu
 * - Handles language switching
 * - Displays environment ribbon in non-production
 */
const Header = (props: IHeaderProps) => {
  // State for mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useAppDispatch();

  /**
   * Handle language locale change
   * @param event - The select change event
   */
  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);   // Persist to session storage
    dispatch(setLocale(langKey));             // Update Redux store
  };

  /**
   * Render development ribbon if not in production
   * @returns JSX for dev ribbon or null
   */
  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  /**
   * Toggle mobile menu state
   */
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div id="app-header">
      {/* Environment ribbon (visible in non-production) */}
      {renderDevRibbon()}
      
      {/* Global loading indicator */}
      <LoadingBar className="loading-bar" />
      
      {/* Main navigation bar */}
      <Navbar 
        data-cy="navbar"       // Cypress testing attribute
        dark                  // Dark color scheme
        expand="md"           // Breakpoint for mobile menu
        fixed="top"           // Fixed to top of viewport
        className="jh-navbar" // Custom class
      >
        {/* Mobile menu toggle button */}
        <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
        
        {/* Application brand/logo */}
        <Brand />
        
        {/* Collapsible menu content */}
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ms-auto" navbar>
            {/* Home link */}
            <Home />
            
            {/* Entities menu (shown when authenticated) */}
            {props.isAuthenticated && <EntitiesMenu />}
            
            {/* Admin menu (shown when admin) */}
            {props.isAuthenticated && props.isAdmin && (
              <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />
            )}
            
            {/* Theme toggle component */}
            <NavItem className="d-flex align-items-center">
              <ThemeToggle />
            </NavItem>
            
            {/* Language selector */}
            <LocaleMenu 
              currentLocale={props.currentLocale} 
              onClick={handleLocaleChange} 
            />
            
            {/* Account controls */}
            <AccountMenu isAuthenticated={props.isAuthenticated} />
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;