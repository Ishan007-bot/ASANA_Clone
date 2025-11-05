import BaseModal from './BaseModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Help & getting started" maxWidth="960px" height="80vh">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Left nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            'Contact sales',
            'Help with features',
            'Contact support',
            'Privacy Statement',
            'Apps and integrations',
            'Keyboard shortcuts',
            'Download the desktop app',
          ].map((item) => (
            <button
              key={item}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-primary)',
                background: '#252628',
                color: 'rgb(245, 244, 243)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Video tutorials */}
          <div>
            <h3 style={{ margin: 0, color: 'rgb(245, 244, 243)', fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>Video tutorials</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1E1F21', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '8px' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    title="Wistia video - Getting started"
                    src="https://fast.wistia.net/embed/iframe/8tvc0mh26w"
                    allowTransparency
                    allowFullScreen
                    scrolling="no"
                    frameBorder={0}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
              </div>
              <div style={{ background: '#1E1F21', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '8px' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    title="Wistia video - Asana hierarchy"
                    src="https://fast.wistia.net/embed/iframe/qmjeoz7yt8"
                    allowTransparency
                    allowFullScreen
                    scrolling="no"
                    frameBorder={0}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Popular topics */}
          <div>
            <h3 style={{ margin: 0, color: 'rgb(245, 244, 243)', fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>Popular topics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { title: 'App integrations', href: 'https://asana.com/apps?category=all-apps' },
                { title: 'Recommended use cases', href: 'https://help.asana.com/s/topic/0TOPc0000001KvzOAE/asana-use-cases?utm_source=asana_inproduct&utm_medium=learning_center&utm_campaign=academy_abc&language=en_US' },
                { title: 'Live training', href: 'https://academy.asana.com/page/upcoming-live-trainings?utm_source=asana_inproduct&utm_medium=learning_center&utm_campaign=academy_abc' },
                { title: 'Asana Academy', href: 'https://academy.asana.com/?utm_source=asana_inproduct&utm_medium=learning_center&utm_campaign=academy_abc' },
              ].map(({ title, href }) => (
                <button
                  key={title}
                  onClick={() => window.open(href, '_blank')}
                  style={{ background: '#252628', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '16px', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ color: 'rgb(245, 244, 243)', fontWeight: 500 }}>{title}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '6px' }}>Learn more</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

export default HelpModal;
