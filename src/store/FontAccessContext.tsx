import React from 'react';

import { BROWSER_SUPPORT } from '@utils/constants.ts';

interface FontAccessContext {
  fontFamilies: Array<string>;
  queryFonts: () => Promise<void>;
  queried: boolean;
  isQuerying: boolean;
  checkPermission: () => Promise<PermissionState>;
}

const fontAccessContext = React.createContext<FontAccessContext>({
  fontFamilies: [],
  queryFonts: () => new Promise((resolve) => resolve()),
  queried: false,
  isQuerying: false,
  checkPermission: async () => null,
});

export const FontAccessContextProvider: React.FC<{
  children: React.ReactElement | Array<React.ReactElement>;
}> = ({ children }) => {
  const [fontFamilies, setFontFamilies] = React.useState<Array<string>>([]);
  const [queried, setQueried] = React.useState<boolean>(false);
  const [isQuerying, setIsQuerying] = React.useState<boolean>(false);

  const checkPermission = async (): Promise<PermissionState> => {
    if (!BROWSER_SUPPORT.queryFonts) {
      return null;
    }
    const permission = await navigator.permissions.query({
      // @ts-ignore
      name: 'local-fonts',
    });
    return permission.state;
  };

  const queryFonts = async () => {
    if (BROWSER_SUPPORT.queryFonts) {
      setIsQuerying(true);
      window
        // @ts-ignore
        .queryLocalFonts()
        .then((queriedFonts: Array<FontData>) => {
          console.log(queriedFonts);
          setFontFamilies(
            queriedFonts.reduce(
              (acc, font) =>
                acc.indexOf(font.family) === -1 ? [...acc, font.family] : acc,
              []
            )
          );
          if (queriedFonts.length === 0) {
            setQueried(false);
            alert('No font queried');
          } else {
            setQueried(true);
          }
          setIsQuerying(false);
        });
    }
  };

  return (
    <fontAccessContext.Provider
      value={{ fontFamilies, queryFonts, queried, isQuerying, checkPermission }}
    >
      {children}
    </fontAccessContext.Provider>
  );
};

export const useFontAccessContext = () => React.useContext(fontAccessContext);
