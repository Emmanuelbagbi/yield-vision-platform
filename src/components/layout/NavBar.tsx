
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChartLine, FileUp, Home, ListFilter, UserCircle2, BarChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { UserButton } from "../auth/UserButton";

type NavItem = {
  title: string;
  path: string;
  icon: JSX.Element;
};

const NavBar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      title: "Home",
      path: "/",
      icon: <Home className="w-5 h-5 mr-2" />,
    },
    {
      title: "Upload Data",
      path: "/upload",
      icon: <FileUp className="w-5 h-5 mr-2" />,
    },
    {
      title: "Predict",
      path: "/predict",
      icon: <ListFilter className="w-5 h-5 mr-2" />,
    },
    {
      title: "Visualize",
      path: "/visualize",
      icon: <BarChart className="w-5 h-5 mr-2" />,
    },
    {
      title: "Results",
      path: "/results",
      icon: <ChartLine className="w-5 h-5 mr-2" />,
    },
  ];

  const renderNavItems = () => (
    <div className={`flex ${isMobile ? "flex-col w-full gap-2" : "items-center gap-1"}`}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setIsOpen(false)}
          className={`${
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          } ${
            isMobile ? "w-full" : ""
          } flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary">YieldVision</span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <UserButton />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path
                      d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-6 flex flex-col gap-4">
                  {renderNavItems()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {renderNavItems()}
            <Separator orientation="vertical" className="h-6" />
            <UserButton />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
