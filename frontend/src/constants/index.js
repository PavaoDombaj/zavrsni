import {
  people01,
  people02,
  people03,
  facebook,
  instagram,
  shield,
  twitter,
  send,
  clockLines,
} from "../assets";

export const navLinks = [
  {
    id: "clients",
    title: "Rezerviraj termin!",
    color: "text-fuchsia-600",
    do: "route",
  },
  {
    id: "home",
    title: "Home",
    do: "hash",
  },
  {
    id: "features",
    title: "Features",
    do: "hash",
  },
  {
    id: "prices",
    title: "Prices",
    do: "route",
  },
];
export const navLinksClients = [
  {
    id: "clients",
    title: "Rezerviraj termin!",
    color: "text-fuchsia-600",
    do: "route",
  },
  {
    id: "/",
    title: "Home",
    do: "",
  },
  {
    id: "features",
    title: "Features",
    do: "hash",
  },
  {
    id: "prices",
    title: "Prices",
    do: "route",
  },
  {
    id: "clients",
    title: "Clients",
    do: "hash",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: clockLines,
    title: "Brzo i efikasno",
    content:
      "Naručivanje nikad nije bilo jednostavnije. Uštedite vrijeme i napor s našom intuitivnom platformom.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Praćenje statistike",
    content:
      "Iskoristite naš dashboard za detaljno praćenje dolazaka i klijenata vašeg salona.",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Slanje Podsjednika",
    content:
      "Smanjite nepojavljivanja na terminima uz mogućnost slanja podsjetnika vašim klijentima. Efikasno i bez poteškoća.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    name: "Herman Jensen",
    title: "Founder & Leader",
    img: people01,
  },
  {
    id: "feedback-2",
    content:
      "Money makes your life easier. If you're lucky to have it, you're lucky.",
    name: "Steve Mark",
    title: "Founder & Leader",
    img: people02,
  },
  {
    id: "feedback-3",
    content:
      "It is usually people in the money business, finance, and international trade that are really rich.",
    name: "Kenn Gallagher",
    title: "Founder & Leader",
    img: people03,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "Zadovoljnih korisnika",
    value: "800+",
  },
  {
    id: "stats-2",
    title: "Rezerviranih termina",
    value: "3200+",
  },
  {
    id: "stats-3",
    title: "Dolazaka na termin",
    value: "96%",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.bookly.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.bookly.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.bookly.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.bookly.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.bookly.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.bookly.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.bookly.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.bookly.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.bookly.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.bookly.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.bookly.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.bookly.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
];

export const clients = [
  
];
