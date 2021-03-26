import { useEffect, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useResizeDetector } from 'react-resize-detector';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

type Editor = monacoEditor.editor.IStandaloneCodeEditor;

interface Props {
  code: string;
  onChange: (code: string) => void;
  language: string;
}

function BaseEditor(props: Props) {
  const editorRef = useRef<Editor>();
  const { width, height, ref } = useResizeDetector();
  useEffect(() => {
    editorRef.current?.layout();
  }, [width, height]);
  return (
    <div ref={ref} className="w-full h-full">
      <MonacoEditor
        language={props.language}
        theme="vs-dark"
        value={props.code}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={props.onChange}
        editorDidMount={(editor: Editor) => (editorRef.current = editor)}
      />
    </div>
  );
}

export default BaseEditor;
