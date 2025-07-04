
import React from 'react';
import { RefreshCw, Sun, Moon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, COLOR_OPTIONS, RADIUS_OPTIONS } from '@/contexts/ThemeContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function ThemeSettings() {
  const { currentColor, currentRadius, isDarkMode, setColor, setRadius, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/40">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Advanced Theme Settings</h3>
              <p className="text-xs text-muted-foreground">Customize colors and appearance</p>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-6 px-4 pb-4">
        {/* Color Section */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Color Theme</h4>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_OPTIONS.map((color) => (
              <Button
                key={color.id}
                variant="ghost"
                className={`h-auto p-2 flex flex-col items-center gap-1 hover:bg-muted ${
                  currentColor === color.id ? 'ring-2 ring-foreground' : ''
                }`}
                onClick={() => setColor(color.id)}
              >
                <div 
                  className="w-5 h-5 rounded-full border border-border"
                  style={{ backgroundColor: `oklch(${color.value})` }}
                />
                <span className="text-xs text-muted-foreground">{color.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Radius Section */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Border Radius</h4>
          <div className="flex gap-2 flex-wrap">
            {RADIUS_OPTIONS.map((radius) => (
              <Button
                key={radius.id}
                variant={currentRadius === radius.id ? "default" : "outline"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setRadius(radius.id)}
              >
                {radius.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Theme Section */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Color Mode</h4>
          <div className="flex gap-2">
            <Button
              variant={!isDarkMode ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2 h-8 px-3"
              onClick={() => setTheme('light')}
            >
              <Sun className="h-3 w-3" />
              <span className="text-xs">Light</span>
            </Button>
            <Button
              variant={isDarkMode ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2 h-8 px-3"
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-3 w-3" />
              <span className="text-xs">Dark</span>
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Quick theme toggle for main dashboard
export function QuickThemeToggle({ asIcon = false }: { asIcon?: boolean }) {
  const { isDarkMode, setTheme } = useTheme();

  const toggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (asIcon) {
    return (
      <span onClick={toggle} className="cursor-pointer">
        {isDarkMode ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="h-8 w-8 px-0"
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
