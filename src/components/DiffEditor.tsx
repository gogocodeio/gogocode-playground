import { useEffect, useRef } from 'react';
import { MonacoDiffEditor } from 'react-monaco-editor';
import { useResizeDetector } from 'react-resize-detector';
import * as monaco from 'monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

type Editor = monacoEditor.editor.IStandaloneDiffEditor;

interface Props {
  code1: string;
  code2: string;
  onCode1Change?: (code: string) => void;
}

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
});

function DiffEditor(props: Props) {
  const editorRef = useRef<Editor>();
  const { width, height, ref } = useResizeDetector();
  useEffect(() => {
    editorRef.current?.layout();
  }, [width, height]);
  return (
    <div ref={ref} className="w-full h-full">
      <MonacoDiffEditor
        language="typescript"
        theme="vs-dark"
        original={props.code1}
        value={props.code2}
        editorDidMount={(editor: Editor) => (editorRef.current = editor)}
        onChange={props.onCode1Change || ((_: string) => {})}
      />
    </div>
  );
}

export default DiffEditor;
