export interface NavigationItem {
  label: string;
  href: string;
}

export interface HeaderProps {
  logo?: string;
  navigationItems?: NavigationItem[];
}
