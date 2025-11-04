import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import projectsApi, { type Project } from '../services/projectsApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function BrowseProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await projectsApi.getAll();
        setProjects(fetchedProjects);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
        setError(errorMessage);
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ padding: '20px', color: 'var(--text-default)' }}>
          <p>Error loading projects: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ProjectDirectoryPageHeader PageHeader PageHeader--border HighlightSol HighlightSol--core PageHeaderThemeablePresentation PageHeaderThemeablePresentation--withActionsButtons HighlightSol--buildingBlock Stack Stack--direction-column Stack--display-block Stack--justify-center">
        <div className="Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-24 Stack--justify-space-between HighlightSol HighlightSol--buildingBlock">
          <div className="PageHeaderThemeablePresentation-avatarAndTitle Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-12 HighlightSol HighlightSol--buildingBlock">
            <div className="PageHeaderThemeablePresentation-titleGroup Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-4 HighlightSol HighlightSol--buildingBlock">
              <div className="PageHeaderThemeablePresentation-title">
                <h1 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--overflowTruncate TypographyPresentation--h4 TypographyPresentation--fontWeightMedium PageHeaderNonEditableTitle HighlightSol HighlightSol--core HighlightSol--buildingBlock" tabIndex={-1} style={{ color: 'rgb(245, 244, 243)' }}>
                  Browse projects
                </h1>
              </div>
            </div>
          </div>
          <div>
            <div className="PageHeaderActionButtonsLayout HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-block">
              <div className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large ButtonPrimaryPresentation ButtonPrimaryPresentation--sentimentSelectedStrong ButtonPrimaryPresentation--enabled PrimaryButton ProjectDirectoryPageHeader-newProjectButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0}>
                <svg aria-hidden="true" className="Icon ButtonThemeablePresentation-leftIcon PlusIcon HighlightSol HighlightSol--core" data-testid="PlusIcon" focusable="false" viewBox="0 0 32 32">
                  <path d="M26,14h-8V6c0-1.1-0.9-2-2-2l0,0c-1.1,0-2,0.9-2,2v8H6c-1.1,0-2,0.9-2,2l0,0c0,1.1,0.9,2,2,2h8v8c0,1.1,0.9,2,2,2l0,0c1.1,0,2-0.9,2-2v-8h8c1.1,0,2-0.9,2-2l0,0C28,14.9,27.1,14,26,14z"></path>
                </svg>
                Create project
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ProjectDirectoryContent ProjectDirectoryRoot-content Stack Stack--direction-column Stack--display-block HighlightSol HighlightSol--buildingBlock">
        <div className="ProjectDirectoryTypeahead ProjectDirectoryContent-search">
          <input
            aria-autocomplete="list"
            aria-controls="project-search-list"
            aria-expanded="false"
            autoComplete="off"
            className="TextInputBase SearchTextInput ProjectDirectoryTypeahead-input"
            placeholder="Find a project"
            role="combobox"
            type="text"
          />
          <svg aria-hidden="true" className="MiniIcon--small MiniIcon ProjectDirectoryTypeahead-searchIcon SearchMiniIcon HighlightSol HighlightSol--core" data-testid="SearchMiniIcon" focusable="false" viewBox="0 0 24 24">
            <path d="m23.56 21.439-3.806-3.806A10.93 10.93 0 0 0 22 11c0-6.065-4.935-11-11-11S0 4.935 0 11s4.935 11 11 11c2.493 0 4.787-.843 6.633-2.246l3.806 3.806c.293.293.677.439 1.061.439a1.5 1.5 0 0 0 1.06-2.56ZM11 19c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8Z"></path>
          </svg>
        </div>
        <div className="ProjectDirectoryFilterBar Stack Stack--direction-row Stack--display-block HighlightSol HighlightSol--buildingBlock">
          <div aria-expanded="false" aria-pressed="false" className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--medium ProjectDirectoryFilterButton ProjectOwnerFilterTypeaheadDropdownButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0}>
            <span className="TypographyPresentation TypographyPresentation--overflowTruncate TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">Owner</span>
            <svg aria-hidden="true" className="Icon--small Icon ButtonThemeablePresentation-rightIcon DownIcon HighlightSol HighlightSol--core" data-testid="DownIcon" focusable="false" viewBox="0 0 32 32">
              <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z"></path>
            </svg>
          </div>
          <div aria-expanded="false" aria-pressed="false" className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--medium ProjectDirectoryFilterButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0}>
            <span className="TypographyPresentation TypographyPresentation--overflowTruncate TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">Members</span>
            <svg aria-hidden="true" className="Icon--small Icon ButtonThemeablePresentation-rightIcon DownIcon HighlightSol HighlightSol--core" data-testid="DownIcon" focusable="false" viewBox="0 0 32 32">
              <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z"></path>
            </svg>
          </div>
          <div aria-expanded="false" aria-pressed="false" className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--medium ProjectDirectoryFilterButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0}>
            <span className="TypographyPresentation TypographyPresentation--overflowTruncate TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">Portfolios</span>
            <svg aria-hidden="true" className="Icon--small Icon ButtonThemeablePresentation-rightIcon DownIcon HighlightSol HighlightSol--core" data-testid="DownIcon" focusable="false" viewBox="0 0 32 32">
              <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z"></path>
            </svg>
          </div>
          <div aria-expanded="false" aria-pressed="false" className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--medium ProjectDirectoryFilterButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0}>
            <span className="TypographyPresentation TypographyPresentation--overflowTruncate TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">Status</span>
            <svg aria-hidden="true" className="Icon--small Icon ButtonThemeablePresentation-rightIcon DownIcon HighlightSol HighlightSol--core" data-testid="DownIcon" focusable="false" viewBox="0 0 32 32">
              <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z"></path>
            </svg>
          </div>
        </div>
        <div className="SpreadsheetGridScroller-container" role="treegrid">
          <div className="SpreadsheetHeaderStructure ProjectDirectoryTableHeader" role="row">
            <div className="SpreadsheetHeaderStructure-left" style={{ width: '376px', position: 'absolute' }}>
              <div className="SpreadsheetHeaderLeftStructure ProjectDirectoryTableHeader-leftColumnHeader">
                <div className="SpreadsheetHeaderColumn SpreadsheetHeaderLeftStructure-headerColumn" role="columnheader" tabIndex={0}>
                  <div className="SpreadsheetHeaderColumn-heading">
                    <span className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--overflowTruncate TypographyPresentation--small SpreadsheetHeaderColumn-columnName HighlightSol HighlightSol--buildingBlock">Name</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="SpreadsheetHeaderStructure-right" style={{ position: 'absolute', left: '376px', right: '0px' }}>
              <div className="Scrollable--withCompositingLayer Scrollable Scrollable--horizontal SpreadsheetHeaderStructure-scrollable" role="presentation" tabIndex={-1}>
                <div className="SpreadsheetHeaderStructure-scrollContent" role="presentation">
                  <div className="SpreadsheetHeaderStructure-rightChildren">
                    <div className="SpreadsheetHeaderColumn--fixedWidth SpreadsheetHeaderColumn ProjectDirectoryTableHeader-columnHeader" role="columnheader" style={{ width: '128px' }} tabIndex={0}>
                      <div className="SpreadsheetHeaderColumn-heading">
                        <span className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--overflowTruncate TypographyPresentation--small SpreadsheetHeaderColumn-columnName HighlightSol HighlightSol--buildingBlock">Members</span>
                      </div>
                    </div>
                    <div className="SpreadsheetHeaderColumn--fixedWidth SpreadsheetHeaderColumn ProjectDirectoryTableHeader-columnHeader" role="columnheader" style={{ width: '248px' }} tabIndex={0}>
                      <div className="SpreadsheetHeaderColumn-heading">
                        <span className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--overflowTruncate TypographyPresentation--small SpreadsheetHeaderColumn-columnName HighlightSol HighlightSol--buildingBlock">Teams and portfolios</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ProjectDirectory-tableHeaderDivider"></div>
          <div className="Scrollable--withCompositingLayer Scrollable Scrollable--vertical SpreadsheetGridScroller-verticalScroller ProjectDirectory-verticalScroller" data-testid="VerticalScroller" role="presentation" tabIndex={-1}>
            <div className="Scrollable Scrollable--horizontal SpreadsheetGridScroller-horizontalScroller" role="presentation" tabIndex={-1}>
              {projects.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  <p>No projects found</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="SpreadsheetRow SpreadsheetRow--enabled ProjectDirectoryProjectRow" role="row">
                    <div className="SpreadsheetRow-stickyCell" style={{ background: 'transparent', position: 'absolute', left: '0px', width: '400px' }}>
                      <div className="ProjectDirectoryProjectRow-leftChildren">
                        <div className="ProjectDirectoryProjectRow-projectIconMaybeWithLock">
                          <div className="ChipWithIcon--withChipFill ChipWithIcon--colorAqua ChipWithIcon ProjectDirectoryProjectRow-projectIcon">
                            <svg aria-hidden="true" className="BaseCustomizationIcon BaseCustomizationIcon--16 BaseCustomizationIcon--aqua" focusable="false" viewBox="0 0 24 24">
                              <path d="M5 5C5 6.3805 3.8805 7.5 2.5 7.5C1.1195 7.5 0 6.3805 0 5C0 3.6195 1.1195 2.5 2.5 2.5C3.8805 2.5 5 3.6195 5 5ZM2.5 9.5C1.1195 9.5 0 10.6195 0 12C0 13.3805 1.1195 14.5 2.5 14.5C3.8805 14.5 5 13.3805 5 12C5 10.6195 3.8805 9.5 2.5 9.5ZM2.5 16.5C1.1195 16.5 0 17.6195 0 19C0 20.3805 1.1195 21.5 2.5 21.5C3.8805 21.5 5 20.3805 5 19C5 17.6195 3.8805 16.5 2.5 16.5ZM9 3V7H24V3H9ZM9 14H24V10H9V14ZM9 21H24V17H9V21Z"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="ProjectDirectoryProjectRow-name">
                          <Link className="ProjectDirectoryProjectRow-projectName" to={`/projects/${project.id}`}>
                            <h6 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--overflowTruncate TypographyPresentation--h6 TypographyPresentation--fontWeightNormal HighlightSol HighlightSol--buildingBlock HighlightSol--core" style={{ color: 'rgb(245, 244, 243)' }}>{project.name}</h6>
                          </Link>
                          <span className="TypographyPresentation TypographyPresentation--colorSuccess TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="SpreadsheetRow-stickyCellPlaceholder" style={{ width: '400px', minWidth: '400px' }}></div>
                    <div className="ProjectDirectoryProjectRow-rightChildren">
                      <div className="ProjectDirectoryProjectRow-facepile">
                        <ul aria-hidden="true" className="FacepileStructure Facepile">
                          {project.members && project.members.length > 0 && (
                            <>
                              <li className="FacepileStructure-item">
                                <div aria-hidden="true" className="EllipsisFacepileAvatar--standardTheme EllipsisFacepileAvatar EllipsisFacepileAvatar--sizeSmall Facepile-ellipsisAvatar Facepile-item" data-testid="ellipsis-avatar">
                                  <svg aria-hidden="true" className="MiniIcon--small MiniIcon MoreMiniIcon HighlightSol HighlightSol--core" data-testid="MoreMiniIcon" focusable="false" viewBox="0 0 24 24">
                                    <path d="M5,12c0,1.4-1.1,2.5-2.5,2.5S0,13.4,0,12s1.1-2.5,2.5-2.5S5,10.6,5,12z M12,9.5c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.5,12,9.5z M21.5,9.5c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5S24,13.4,24,12S22.9,9.5,21.5,9.5z"></path>
                                  </svg>
                                </div>
                              </li>
                              {project.members.slice(0, 4).map((member: any, idx: number) => (
                                <li key={idx} className="FacepileStructure-item">
                                  <span aria-hidden="true" className={`Facepile-avatar Facepile-item Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color${idx % 8} HighlightSol HighlightSol--core`}>
                                    <span className="AvatarPhoto-image"></span>
                                    <span aria-hidden="true" aria-label={member.user?.initials || member.user?.name || 'U'} className="AvatarPhoto-initials">{member.user?.initials || member.user?.name?.charAt(0) || 'U'}</span>
                                  </span>
                                </li>
                              ))}
                            </>
                          )}
                        </ul>
                      </div>
                      <div className="ProjectDirectoryProjectRow-teamsAndPortfoliosSection" style={{ width: '240px' }}>
                        {project.team && (
                          <Link className="PillThemeablePresentation PillThemeablePresentation--small PillPresentation PillPresentation--colorNone PillPresentation--interactive ProjectDirectoryProjectRow-pill HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-4" to="/home">
                            <svg aria-hidden="true" className="MiniIcon UsersMiniIcon HighlightSol HighlightSol--core" data-testid="UsersMiniIcon" focusable="false" viewBox="0 0 24 24">
                              <path d="M16 14c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7Zm0-12c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5Zm8 19v2a1 1 0 1 1-2 0v-2c0-1.654-1.346-3-3-3h-6c-1.654 0-3 1.346-3 3v2a1 1 0 1 1-2 0v-2c0-2.757 2.243-5 5-5h6c2.757 0 5 2.243 5 5ZM1 7c0-3.86 3.141-7 7-7a1 1 0 1 1 0 2C5.243 2 3 4.243 3 7s2.243 5 5 5a1 1 0 1 1 0 2c-3.859 0-7-3.14-7-7Zm6 10a1 1 0 0 1-1 1H5c-1.654 0-3 1.346-3 3v2a1 1 0 1 1-2 0v-2c0-2.757 2.243-5 5-5h1a1 1 0 0 1 1 1Z"></path>
                            </svg>
                            <span className="TypographyPresentation TypographyPresentation--overflowTruncate TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">{project.team.name || 'My workspace'}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BrowseProjects;

