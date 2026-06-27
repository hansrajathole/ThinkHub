import React from "react";
import { Editor } from "@monaco-editor/react";

const CodeEditor = ({ language, code, onChange, onMount, options = {} }) => {
  const defaultOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    ...options
  };

  const monacoTheme = document.documentElement.classList.contains('dark') ? 'hc-black' : 'light';


  return (
    <div className="h-full w-full overflow-hidden rounded">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={onChange}
        theme={monacoTheme}
        onMount={onMount}
        options={defaultOptions}
      />
    </div>
  );
};

export default CodeEditor;