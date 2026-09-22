import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { toEnglishKeys } from './convert.js';
import './styles.css';

function Icon({ name, size = 20, ...props }) {
  const paths = {
    swap: <><path d="M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    keyboard: <><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 15h10" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function App() {
  const [input, setInput] = useState('');
  const [copyState, setCopyState] = useState('idle');
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const output = toEnglishKeys(input);

  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = setTimeout(() => setCopyState('idle'), 2500);
    return () => clearTimeout(timer);
  }, [copyState]);

  function update(value) {
    setInput(value);
    setCopyState('idle');
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyState('copied');
    } catch {
      outputRef.current.focus();
      outputRef.current.select();
      setCopyState('error');
    }
  }

  return <div className="page">
    <header className="header">
      <a href="#" className="brand" aria-label="키바꿈 홈"><span className="brand-icon"><Icon name="swap" size={21} /></span>키바꿈<span className="brand-divider" /><span className="brand-caption">한영 자판 변환기</span></a>
      <a className="guide-link" href="#how-it-works">사용 안내 <span aria-hidden="true">↗</span></a>
    </header>

    <main>
      <section className="hero" aria-labelledby="title">
        <div className="eyebrow"><span />한글에서 영문으로, 한 번에</div>
        <h1 id="title">한글 그대로,<br className="mobile-break" /> <span>영문 자판으로.</span></h1>
        <p>한글로 입력하면, 같은 키의 영문으로 바꿔드려요.<br />영문, 숫자, 기호는 입력한 그대로 유지됩니다.</p>
      </section>

      <section className="converter" aria-label="한영 자판 변환">
        <div className="input-pane pane">
          <div className="pane-header"><label htmlFor="korean-input"><span className="language-icon">가</span>한글 입력</label><span className="language-code">KOREAN</span></div>
          <textarea ref={inputRef} id="korean-input" value={input} onChange={event => update(event.target.value)} placeholder="변환할 한글을 입력해 보세요." spellCheck="false" autoCapitalize="off" autoCorrect="off" />
          <div className="pane-footer"><span className="character-count">{Array.from(input).length.toLocaleString()}자</span><button className="clear-button" disabled={!input} onClick={() => { update(''); inputRef.current.focus(); }}><Icon name="close" size={15} />지우기</button></div>
        </div>
        <div className="direction" aria-hidden="true"><Icon name="arrow" size={20} /></div>
        <div className="output-pane pane">
          <div className="pane-header"><label htmlFor="english-output"><span className="language-icon">A</span>영문 변환 결과</label><span className="live-badge"><span />실시간 변환</span></div>
          <textarea ref={outputRef} id="english-output" value={output} readOnly placeholder={'영문 자판으로 바뀐 내용이\n여기에 표시됩니다.'} spellCheck="false" />
          <div className="pane-footer"><span className="character-count">{Array.from(output).length.toLocaleString()}자</span><button className="copy-button" disabled={!output} onClick={copy}><Icon name={copyState === 'copied' ? 'check' : 'copy'} size={17} />{copyState === 'copied' ? '복사 완료' : '결과 복사'}</button></div>
        </div>
      </section>
      <div className="below-converter">
        <div className="examples"><span>이렇게 입력해 보세요</span>{['한글123', '안녕하세요', 'ㅋㅋㅋ'].map(example => <button key={example} onClick={() => { update(example); inputRef.current.focus(); }}>{example}<span aria-hidden="true">↗</span></button>)}</div>
        <span className="save-note"><Icon name="shield" size={15} />입력 내용은 저장되지 않아요</span>
      </div>
      <p className="sr-only" role="status">{copyState === 'copied' ? '변환 결과를 복사했습니다.' : ''}</p>
      {copyState === 'error' && <p className="copy-error" role="alert">자동 복사를 사용할 수 없어요. 선택된 결과를 Ctrl+C 또는 ⌘C로 복사해 주세요.</p>}

      <section className="explanation" id="how-it-works" aria-labelledby="guide-title">
        <div className="explanation-copy"><div className="section-label"><Icon name="keyboard" size={18} />같은 키, 다른 글자</div><h2 id="guide-title">발음이 아닌, 자판을 바꿔요.</h2><p>두벌식 한글 자판을 기준으로 변환합니다.<br />한/영 키를 누르고 같은 키를 입력한 것과 같아요.</p></div>
        <div className="key-demo" aria-label="한글 한은 영문 g, k, s 키로 변환됩니다"><span className="hangul-example">한</span><Icon name="arrow" size={22} /><div className="keys"><kbd><span>G</span><small>ㅎ</small></kbd><kbd><span>K</span><small>ㅏ</small></kbd><kbd><span>S</span><small>ㄴ</small></kbd></div><span className="key-result">gks</span></div>
      </section>
    </main>
    <footer><span>키 하나로 가벼워지는 일상, <strong>키바꿈</strong></span><span>한국어 두벌식 · QWERTY</span></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
