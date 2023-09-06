import React from 'react';

interface FontAccessContext {
  fontFamilies: Array<string>;
  queryFonts: () => Promise<void>;
}

const fontAccessContext = React.createContext<FontAccessContext>({
  fontFamilies: [],
  queryFonts: () => new Promise((resolve) => resolve()),
});

export const FontAccessContextProvider: React.FC<{
  children: React.ReactElement | Array<React.ReactElement>;
}> = ({ children }) => {
  const [fontFamilies, setFontFamilies] = React.useState<Array<string>>([]);

  const queryFonts = async () => {
    if ('queryLocalFonts' in window) {
      window
        .queryLocalFonts()
        .then((queriedFonts: Array<FontData>) =>
          setFontFamilies(
            queriedFonts.reduce(
              (acc, font) =>
                acc.indexOf(font.family) === -1 ? [...acc, font.family] : acc,
              []
            )
          )
        );
    }
  };

  return (
    <fontAccessContext.Provider value={{ fontFamilies, queryFonts }}>
      {children}
    </fontAccessContext.Provider>
  );
};

export const useFontAccessContext = () => React.useContext(fontAccessContext);
