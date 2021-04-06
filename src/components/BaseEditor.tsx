import { useEffect, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useResizeDetector } from 'react-resize-detector';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

type Editor = monacoEditor.editor.IStandaloneCodeEditor;

interface Props {
  code: string;
  onChange: (code: string) => void;
  language: string;
  onSave?: () => void;
}

function BaseEditor(props: Props) {
  const { language, code, onChange, onSave = () => {} } = props;
  const editorRef = useRef<Editor>();
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    editorRef.current?.layout();
  }, [width, height]);

  useEffect(() => {
    const editor = editorRef.current;
    editor && editor.addCommand(monacoEditor.KeyMod.CtrlCmd | monacoEditor.KeyCode.KEY_S, onSave);
  }, [onSave]);

  return (
    <div ref={ref} className="w-full h-full">
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={code}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={onChange}
        editorDidMount={(editor: Editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}

export default BaseEditor;
