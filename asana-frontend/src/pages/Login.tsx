import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__login.css';

function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, navigate to welcome page on any email
    if (email) {
      // Store email for welcome page
      localStorage.setItem('signupEmail', email);
      navigate('/welcome');
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
              <div className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--xlarge ButtonSecondaryPresentation ButtonSecondaryPresentation--sentimentDefault SecondaryButton GoogleSignInButton--sparse GoogleSignInButton LoginDefaultView-ssoButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0} onClick={() => { localStorage.setItem('signupEmail', 'user@gmail.com'); navigate('/welcome'); }}>
                <svg className="ButtonThemeablePresentation-leftIcon GoogleSignInButton-logo--sparse GoogleSignInButton-logo" viewBox="0 0 18 18">
                  <path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" fill="#4285F4"></path>
                  <path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" fill="#34A853"></path>
                  <path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" fill="#FBBC05"></path>
                  <path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" fill="#EA4335"></path>
                </svg>
                Continue with Google
              </div>
              <span className="SeparatorRow LoginDefaultView-separatorRow">
                <span className="SeparatorRow-horizontalLine"></span>
                <span className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--large SeparatorRow-label LoginDefaultView-separatorRowLabel HighlightSol HighlightSol--buildingBlock">or</span>
                <span className="SeparatorRow-horizontalLine"></span>
              </span>
              <form className="LoginEmailForm" name="loginEmailForm" onSubmit={handleSubmit}>
                <div className="FormRowLayout--labelPlacementTop FormRowLayout LoginEmailForm-email">
                  <div className="FormRowLayout-label">
                    <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="email">Email address</label>
                  </div>
                  <div className="FormRowLayout-contents">
                    <div className="ValidatedInput HighlightSol HighlightSol--core">
                      <input
                        aria-required="true"
                        autoComplete="username"
                        autoFocus
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
                <div className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large LoginButton LoginEmailForm-continueButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0} onClick={handleSubmit}>
                  Continue
                </div>
              </form>
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <a className="LinkThemeablePresentation LinkSecondaryPresentation LinkSecondaryPresentation--sentimentDefault SecondaryLink HighlightSol HighlightSol--core HighlightSol--buildingBlock" href="/login-password" onClick={(e) => { e.preventDefault(); navigate('/login-password'); }}>
                  Log in with password
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

export default Login;

