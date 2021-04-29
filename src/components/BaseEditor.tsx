import { useEffect, useMemo, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useResizeDetector } from 'react-resize-detector';
import { noop } from '../utils/index';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

type Editor = monacoEditor.editor.IStandaloneCodeEditor;

interface Props {
  code: string;
  onChange?: (code: string) => void;
  language: string;
  onSave?: () => void;
  readOnly?: boolean;
}

function BaseEditor(props: Props) {
  const { language, code, onChange = noop, onSave = noop, readOnly = false } = props;
  const editorRef = useRef<Editor>();
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    editorRef.current?.layout();
  }, [width, height]);
  useEffect(() => {
    const editor = editorRef.current;
    editor && editor.addCommand(monacoEditor.KeyMod.CtrlCmd | monacoEditor.KeyCode.KEY_S, onSave);
  }, [onSave]);

  const options = useMemo(
    () => ({
      minimap: {
        enabled: false,
      },
      readOnly,
    }),
    [readOnly],
  );

  return (
    <div ref={ref} className="w-full h-full">
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={(editor: Editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}

export default BaseEditor;
