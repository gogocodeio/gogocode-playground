import { useState, useEffect } from "react";
import clsx from "clsx";

export function Share({
  initialPath,
  editorRef,
  dirty,
  layout,
  responsiveSize,
  activeTab,
  onShareStart,
  onShareComplete,
  tailwindVersion,
}: any) {
  const [{ state, path, errorText }, setState] = useState({
    state: "disabled",
    path: initialPath,
    errorText: "",
  });

  useEffect(() => {
    setState((current) =>
      current.state === "idle" || current.state === "disabled"
        ? {
            state: "disabled",
            path: initialPath,
            errorText: current.errorText,
          }
        : current
    );
  }, [initialPath]);

  useEffect(() => {
    let current = true;
    if (state === "loading") {
      if (onShareStart) onShareStart();
      window
        .fetch("https://fether.m.taobao.com/gogocode-playground/save-snippet", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            inputCode: editorRef.current.editor.getModel().getValue(),
            transformCode: editorRef.current.editor.getModel().getValue(),
          }),
        })
        .then((res) => {
          if (!res.ok) throw res;
          return res;
        })
        .then((res) => res.json())
        .then((res) => {
          if (current) {
            const newPath = `/${res?.snippet?.uuid}`;
            if (onShareComplete) onShareComplete(newPath);
            navigator.clipboard
              .writeText(window.location.origin + newPath)
              .then(() => {
                if (current) {
                  setState({ state: "copied", path: newPath, errorText });
                }
              })
              .catch(() => {
                if (current) {
                  setState({ state: "disabled", path: newPath, errorText });
                }
              });
          }
        })
        .catch((error) => {
          if (!current) return;

          const defaultErrorText = "Whoops! Something went wrong.";

          if (error instanceof window.Response) {
            error.json().then((response) => {
              if (!current) return;
              if (
                typeof response.errors === "object" &&
                response.errors !== null &&
                !Array.isArray(response.errors)
              ) {
                setState({
                  state: "error",
                  path,
                  errorText:
                    response.errors[Object.keys(response.errors)[0]][0] ||
                    defaultErrorText,
                });
              } else {
                setState({
                  state: "error",
                  path,
                  errorText: defaultErrorText,
                });
              }
            });
          } else {
            setState({
              state: "error",
              path,
              errorText: defaultErrorText,
            });
          }
        });
    } else if (state === "copied") {
      window.setTimeout(() => {
        setState(({ state, path: currentPath }) =>
          state === "copied" && currentPath === path
            ? { state: "disabled", path: currentPath, errorText }
            : { state, path: currentPath, errorText }
        );
      }, 1500);
    }
    return () => {
      current = false;
    };
  }, [
    state,
    path,
    editorRef,
    onShareStart,
    onShareComplete,
    tailwindVersion,
    layout,
    responsiveSize,
    activeTab,
    errorText,
  ]);

  useEffect(() => {
    if (dirty) {
      setState((s) => ({ ...s, state: "idle" }));
    }
  }, [dirty]);

  return (
    <div className="hidden sm:flex items-center space-x-4 min-w-0">
      <button
        type="button"
        className={clsx(
          "relative flex-none rounded-md border border-gray-200 text-sm font-medium leading-5 py-1.5 px-2 lg:px-4 focus:border-turquoise-400 focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-transparent dark:focus:bg-gray-700 dark:focus:border-turquoise-500",
          {
            "opacity-50": state === "disabled",
            "cursor-auto":
              state === "disabled" || state === "copied" || state === "loading",
            "hover:bg-gray-50 dark:hover:bg-gray-700":
              state !== "disabled" && state !== "copied" && state !== "loading",
          }
        )}
        onClick={() => {
          setState({ state: "loading", path, errorText });
        }}
        disabled={
          state === "copied" || state === "disabled" || state === "loading"
        }
      >
        <span
          className={clsx("absolute inset-0 flex items-center justify-center", {
            invisible: state === "copied" || state === "loading",
          })}
          aria-hidden={
            state === "copied" || state === "loading" ? "true" : "false"
          }
        >
          Share
        </span>
        <span
          className={clsx("absolute inset-0 flex items-center justify-center", {
            invisible: state !== "loading",
          })}
          aria-hidden={state !== "loading" ? "true" : "false"}
        >
          <span className="sr-only">Loading</span>
          <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4 animate-spin">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
        <span
          className={clsx("text-teal-600", { invisible: state !== "copied" })}
          aria-hidden={state === "copied" ? "false" : "true"}
        >
          Copied!
        </span>
      </button>
      {state === "error" && (
        <p
          className="text-sm leading-5 font-medium text-gray-500 dark:text-gray-400 truncate"
          title={errorText}
        >
          <span className="sr-only">Error: </span>
          {errorText}
        </p>
      )}
      {(state === "copied" || state === "disabled") && path && (
        <button
          type="button"
          className="group flex-auto min-w-0 flex items-center space-x-1.5 text-sm leading-5 font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          title={`https://play.gogocode.io${path}`}
          onClick={() => {
            navigator.clipboard
              .writeText(window.location.origin + path)
              .then(() => {
                setState((currentState) => ({
                  ...currentState,
                  state: "copied",
                }));
              });
          }}
        >
          <span className="truncate">{path}</span>
          <svg
            width="20"
            height="20"
            className="flex-none fill-current opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 4.5H6A1.5 1.5 0 004.5 6v4A1.5 1.5 0 006 11.5h1V10a3 3 0 013-3h1.5V6A1.5 1.5 0 0010 4.5zM13 7V6a3 3 0 00-3-3H6a3 3 0 00-3 3v4a3 3 0 003 3h1v1a3 3 0 003 3h4a3 3 0 003-3v-4a3 3 0 00-3-3h-1zm-3 1.5h4a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 018.5 14v-4A1.5 1.5 0 0110 8.5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
