import Layout from '../components/Layout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function NewProject() {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName) {
      // In a real app, create the project here
      navigate('/projects');
    }
  };

  return (
    <Layout>
      <div className="NewProjectPageContent" style={{ maxWidth: 'min(600px, 90vw)', margin: '0 auto' }}>
        <div className="PageHeader PageHeader--border HighlightSol HighlightSol--core PageHeaderThemeablePresentation HighlightSol--buildingBlock Stack Stack--direction-column Stack--display-block Stack--justify-center">
          <h1 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--h4 TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock" style={{ color: 'rgb(245, 244, 243)' }}>
            Create New Project
          </h1>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ marginBottom: '16px' }}>
            <div className="FormRowLayout-label">
              <label className="LabelPresentation HighlightSol HighlightSol--core">Project Name</label>
            </div>
            <div className="FormRowLayout-contents">
              <input
                type="text"
                className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large ButtonPrimaryPresentation ButtonPrimaryPresentation--sentimentSelectedStrong ButtonPrimaryPresentation--enabled PrimaryButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0} onClick={handleSubmit}>
            Create Project
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default NewProject;

