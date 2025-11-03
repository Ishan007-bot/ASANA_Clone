import { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import GlobalTopbar from './GlobalTopbar';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="notranslate" id="asana">
      <div className="AppRoot" tabIndex={-1}>
        <div className="AppRoot-fullPage" id="asana_full_page">
          <GlobalTopbar onToggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
          <div className="AsanaMain">
            <div className="AsanaMain-mainLayer" id="asana_main">
              {sidebarVisible && <Sidebar isCollapsed={!sidebarVisible} />}
              <main className="AsanaMain-asanaPageAndTopbar" id="asana_main_page" tabIndex={-1}>
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;

