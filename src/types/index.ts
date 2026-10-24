export interface CarouselItem {
  id: number;
  name: string;
  img: string;
}

export interface ProductHighlight {
  icon?: string;
  text: string;
}

export interface Product {
  id: string;
  title: string;
  img: string;
  tag: string;
  isGoldTag?: boolean;
  price: string;
  rating: number;
  ratingStars: string;
  ratingCount: string;
  prep: string;
  desc: string;
  tags: string[];
  highlights: string[];
  category: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  label: string;
  count: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterCard {
  title: string;
  lines: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  ariaLabel: string;
}

export interface SiteData {
  brand: {
    name: string;
    tagline: string;
    subTagline: string;
    heritageText: string;
    logoImg: string;
    copyright: string;
  };
  navigation: {
    headerLinks: NavLink[];
    headerCta: NavLink;
    footerLinks: NavLink[];
    socialLinks: SocialLink[];
  };
  hero: {
    heading: string;
    scrollHintText: string;
  };
  menu: {
    eyebrow: string;
    title: string;
    desc: string;
    banner: {
      title: string;
      sub: string;
      primaryBtn: NavLink;
      secondaryBtn: NavLink;
    };
  };
  footerBento: {
    hours: {
      title: string;
      schedule: string[];
      serviceTypes: string;
    };
    kitchen: {
      title: string;
      description: string;
    };
    contact: {
      title: string;
      phone: string;
      subText: string;
    };
  };
  legalLinks: NavLink[];
}
