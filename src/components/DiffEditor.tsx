import { useEffect, useRef } from 'react';
import { MonacoDiffEditor } from 'react-monaco-editor';
import { useResizeDetector } from 'react-resize-detector';
import * as monaco from 'monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { noop } from 'react-monaco-editor/lib/utils';

type Editor = monacoEditor.editor.IStandaloneDiffEditor;

interface Props {
  code1: string;
  code2: string;
  onCode1Change?: (code: string) => void;
  language: string;
}

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
});

function DiffEditor(props: Props) {
  const { language, code1, code2, onCode1Change = noop } = props;
  const editorRef = useRef<Editor>();
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    editorRef.current?.layout();
  }, [width, height]);

  return (
    <div ref={ref} className="w-full h-full">
      <MonacoDiffEditor
        language={language}
        theme="vs-dark"
        original={code1}
        value={code2}
        editorDidMount={(editor: Editor) => (editorRef.current = editor)}
        onChange={onCode1Change}
      />
    </div>
  );
}

export default DiffEditor;
