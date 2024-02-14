import React from 'react';

import { settingsDB } from '@store/idb.ts';

export enum EDITOR_VIEWS {
  MD = 'md',
  SPLIT = 'split',
  HTML = 'html',
}

export enum EditMode {
  NONE = 'none',
  MD = 'md',
  HTML = 'html',
}

interface SettingsContext {
  appSettings: Record<string, string>;
  setAppSettings: (settings: Record<string, string>) => void;
  editorView: EDITOR_VIEWS;
  setEditorView: (editorView: EDITOR_VIEWS) => void;
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
}

const settingsContext = React.createContext<SettingsContext>({
  appSettings: {},
  setAppSettings: () => {},
  editorView: null,
  setEditorView: () => {},
  editMode: EditMode.NONE,
  setEditMode: () => {},
});

export const SettingsContextProvider: React.FC<{
  children: React.ReactElement | Array<React.ReactElement>;
}> = ({ children }) => {
  const [init, setInit] = React.useState<boolean>(false);
  const [editorView, setEditorView] = React.useState<EDITOR_VIEWS>(null);
  const [appSettings, setAppSettings] =
    React.useState<Record<string, string>>(null);
  const [editMode, setEditMode] = React.useState<EditMode>(EditMode.NONE);

  React.useEffect(() => {
    if (!init) {
      settingsDB.get('editorView').then((view) => view && setEditorView(view));
      settingsDB
        .get('appSettings')
        .then((settings) => settings && setAppSettings(settings));
      setInit(true);
    }
    settingsDB.set('editorView', editorView);
    settingsDB.set('appSettings', appSettings);
  }, [editorView, appSettings]);

  return (
    <settingsContext.Provider
      value={{
        editorView,
        setEditorView,
        appSettings,
        setAppSettings,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </settingsContext.Provider>
  );
};

export const useEditorView = (): [
  editorView: EDITOR_VIEWS,
  setEditorView: (editorView: EDITOR_VIEWS) => void
] => {
  const { editorView, setEditorView } =
    React.useContext<SettingsContext>(settingsContext);
  return [editorView || EDITOR_VIEWS.SPLIT, setEditorView];
};

export const useAppSettings = (): [
  appSettings: Record<string, string>,
  setAppSettings: (appSettings: Record<string, string>) => void
] => {
  const { appSettings, setAppSettings } =
    React.useContext<SettingsContext>(settingsContext);
  return [appSettings || {}, setAppSettings];
};

export const useEditMode = (): [
  isEditing: EditMode,
  setIsEditing: (mode: EditMode) => void
] => {
  const { editMode, setEditMode } =
    React.useContext<SettingsContext>(settingsContext);
  return [editMode, setEditMode];
};
