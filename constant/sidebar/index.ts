import {
  Contact,
  Database,
  DiffIcon,
  Flag,
  LayoutDashboard,
  LucideIcon,
  ScrollText,
  Settings,
  ShoppingBasket,
  ShoppingCart,
  Slack,
  Store,
  User,
  Users,
} from "lucide-react";

export type Option = {
  isCollapsible?: boolean;
  name: string;
  link?: string;
  icon: LucideIcon;
  dropDownOptions?: Option[];
};

export const options: {
  heading: string;
  options: Option[];
}[] = [
  {
    heading: "general",
    options: [
      {
        isCollapsible: false,
        name: "Dashboard",
        link: "",
        icon: LayoutDashboard,
      },
      {
        isCollapsible: false,
        name: "Checkout",
        link: "checkout",
        icon: ShoppingCart,
      },
    ],
  },
  {
    heading: "management",
    options: [
      {
        isCollapsible: true,
        name: "Shop",
        icon: Store,
        dropDownOptions: [
          {
            name: "Products",
            link: "products",
            icon: ShoppingBasket,
          },
          {
            name: "Accessories",
            link: "accessories",
            icon: DiffIcon,
          },
          {
            name: "Brands",
            link: "brands",
            icon: Slack,
          },
          {
            name: "Settings",
            link: "settings",
            icon: Settings,
          },
        ],
      },
      {
        isCollapsible: false,
        name: "Account",
        link: "account",
        icon: User,
      },
      {
        isCollapsible: false,
        name: "Team",
        link: "team",
        icon: Users,
      },
      {
        isCollapsible: false,
        name: "Contacts",
        link: "contacts",
        icon: Contact,
      },
      {
        isCollapsible: false,
        name: "Kanban",
        link: "kanban",
        icon: Flag,
      },
      {
        isCollapsible: false,
        name: "Media",
        link: "media",
        icon: Database,
      },
    ],
  },
];
