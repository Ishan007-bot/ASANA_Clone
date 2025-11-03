import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__login.css';

function LoginPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      navigate('/home');
    }
  };

  return (
    <div id="Login-appRoot">
      <div className="LoginCardLayout">
        <div className="LoginStickyLogoBar">
          <nav className="LoginStickyLogoBar-nav">
            <a className="LinkThemeablePresentation LinkPrimaryPresentation LinkPrimaryPresentation--sentimentSelected LoginStickyLogoBar-asanaLogoContainer PrimaryLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="/">
              <img alt="Asana logo" className="LoginStickyLogoBar-asanaLogo" src="/assets/d3ki9tyy5l5ruj_cloudfront_net__logo.png"/>
            </a>
          </nav>
        </div>
        <div className="LoginCardLayout-card">
          <div className="LoginCardLayout-card--content">
            <h2 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--h2 TypographyPresentation--fontWeightNormal TypographyPresentation--textAlignCenter TypographyPresentation--wrapStylePretty LoginCardLayout-title--withSubtitle LoginCardLayout-title HighlightSol HighlightSol--buildingBlock HighlightSol--core">
              Welcome to Asana
            </h2>
            <h3 className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--xlarge TypographyPresentation--fontWeightMedium TypographyPresentation--textAlignCenter TypographyPresentation--wrapStylePretty LoginCardLayout-subtitle HighlightSol HighlightSol--buildingBlock HighlightSol--core">
              To get started, please sign in
            </h3>
            <div className="LoginDefaultView-content">
              <form className="LoginEmailForm" name="loginPasswordForm" onSubmit={handleSubmit}>
                <div className="FormRowLayout--labelPlacementTop FormRowLayout LoginEmailForm-email">
                  <div className="FormRowLayout-label">
                    <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="email">Email address</label>
                  </div>
                  <div className="FormRowLayout-contents">
                    <div className="ValidatedInput HighlightSol HighlightSol--core">
                      <input
                        aria-required="true"
                        autoComplete="username"
                        className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium LoginEmailForm-emailInput HighlightSol HighlightSol--core"
                        id="email"
                        name="e"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ marginTop: '16px' }}>
                  <div className="FormRowLayout-label">
                    <div className="Stack Stack--direction-row Stack--display-block Stack--justify-space-between HighlightSol HighlightSol--buildingBlock">
                      <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="password">Password</label>
                      <a className="LinkThemeablePresentation LinkSecondaryPresentation LinkSecondaryPresentation--sentimentDefault SecondaryLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="#" style={{ fontSize: '14px' }}>
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div className="FormRowLayout-contents">
                    <div className="ValidatedInput HighlightSol HighlightSol--core">
                      <div style={{ position: 'relative' }}>
                        <input
                          aria-required="true"
                          autoComplete="current-password"
                          className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium LoginEmailForm-emailInput HighlightSol HighlightSol--core"
                          id="password"
                          name="p"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--small"
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            fontSize: '12px'
                          }}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large LoginButton LoginEmailForm-continueButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0} onClick={handleSubmit} style={{ marginTop: '24px', width: '100%' }}>
                  Log in with password
                </div>
              </form>
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <a className="LinkThemeablePresentation LinkSecondaryPresentation LinkSecondaryPresentation--sentimentDefault SecondaryLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="/login">
                  Go back
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="LoginFooter">
          <nav>
            <ul className="LoginFooter-navRow">
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Asana.com</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://help.asana.com"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Support</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/apps"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Integrations</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://forum.asana.com"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Forum</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://developers.asana.com"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Developers & API</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/resources"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Resources</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/guide"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Guide</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/templates"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Templates</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/pricing"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Pricing</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/terms"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Terms</span></a></li>
              <li className="LoginFooter-navRowItem"><a className="LinkThemeablePresentation LinkHiddenPresentation LinkHiddenPresentation--sentimentSelected HiddenLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://asana.com/terms#privacy-policy"><span className="TypographyPresentation TypographyPresentation--small HighlightSol HighlightSol--buildingBlock">Privacy</span></a></li>
            </ul>
          </nav>
          <span className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small TypographyPresentation--textAlignCenter HighlightSol HighlightSol--buildingBlock">
            This site is protected by reCAPTCHA and the Google <a className="LinkThemeablePresentation LinkThemeablePresentation--alwaysUnderline LinkSecondaryPresentation LinkSecondaryPresentation--sentimentDefault SecondaryLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://policies.google.com/privacy" rel="noreferrer noopener" target="_blank">Privacy Policy</a> and <a className="LinkThemeablePresentation LinkThemeablePresentation--alwaysUnderline LinkSecondaryPresentation LinkSecondaryPresentation--sentimentDefault SecondaryLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="https://policies.google.com/terms" rel="noreferrer noopener" target="_blank">Terms of Service</a> apply.
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPassword;




