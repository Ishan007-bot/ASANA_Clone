import { useState, useRef, useEffect } from 'react';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CommentFormProps {
  taskId: string;
  placeholder?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialContent?: string;
}

function CommentForm({ taskId, placeholder = 'Add a comment...', onSubmit, onCancel, initialContent = '' }: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [showButtons, setShowButtons] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
      setShowButtons(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape' && onCancel) {
      onCancel();
      setContent('');
      setShowButtons(false);
    }
  };

  return (
    <div className="CommentForm" style={{ marginBottom: '16px' }}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setShowButtons(true);
        }}
        onFocus={() => setShowButtons(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="TextInputBase TextInput TextInput--medium HighlightSol HighlightSol--core"
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          resize: 'vertical',
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#000000',
        }}
      />
      {showButtons && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
          {onCancel && (
            <button
              onClick={() => {
                setContent('');
                setShowButtons(false);
                onCancel();
              }}
              className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonSecondaryPresentation HighlightSol HighlightSol--core"
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#2A2B2D',
                cursor: 'pointer',
                color: '#374151',
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonPrimaryPresentation HighlightSol HighlightSol--core"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: content.trim() ? '#4573d2' : '#9ca3af',
              color: 'white',
              cursor: content.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Post
          </button>
        </div>
      )}
      {showButtons && (
        <div
          className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
          style={{ marginTop: '4px', fontSize: '11px' }}
        >
          Press Cmd/Ctrl + Enter to submit
        </div>
      )}
    </div>
  );
}

export default CommentForm;


