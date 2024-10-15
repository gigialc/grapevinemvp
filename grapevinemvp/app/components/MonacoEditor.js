import React, { useEffect, useRef } from 'react';
// import * as monaco from 'monaco-editor';

const MonacoEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    import('monaco-editor').then((monaco) => {
    const editor = monaco.editor.create(editorRef.current, {
      value: `function hello() {\n\tconsole.log("Hello, world!");\n}`,
      language: 'javascript',
      theme: 'vs-dark', // You can also use 'vs-light' or custom themes
      automaticLayout: true, // Adjusts the editor layout automatically
    });

    return () => {
      editor.dispose(); // Clean up the editor when the component unmounts
    };
  } );
  }, []);

  return <div ref={editorRef} style={{ height: '90vh', width: '100%' }}></div>;
};

export default MonacoEditor;