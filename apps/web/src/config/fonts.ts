export interface FontConfig {
  key: string;
  family: string;
  links: { rel: string; href: string; crossOrigin?: boolean }[];
}

export const fonts: FontConfig[] = [
  {
    key: "system",
    family: "unset",
    links: [],
  },
  {
    key: "montserrat",
    family: "'Montserrat', sans-serif",
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: true },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
      },
    ],
  },
];
