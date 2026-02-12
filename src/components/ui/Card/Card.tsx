import { forwardRef, useState, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Card.module.css';
import { CardContext } from './CardContext';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card visual variant */
  variant?: 'elevated' | 'outlined' | 'filled' | 'accent';
  /** Padding size */
  size?: 'sm' | 'md' | 'lg';
  /** Makes card interactive (clickable) */
  interactive?: boolean;
  /** Makes card collapsible (accordion) */
  collapsible?: boolean;
  /** Default expanded state for collapsible cards */
  defaultExpanded?: boolean;
  /** Loading state - shows skeleton UI */
  loading?: boolean;
  /** As HTML element */
  as?: 'div' | 'article' | 'section';
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'elevated',
      size = 'md',
      interactive = false,
      collapsible = false,
      defaultExpanded = true,
      loading = false,
      as: Component = 'div',
      children,
      onClick,
      onExpandedChange,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const toggleExpanded = () => {
      const newState = !isExpanded;
      setIsExpanded(newState);
      onExpandedChange?.(newState);
    };

    return (
      <CardContext.Provider value={{ size, isExpanded, isCollapsible: collapsible, toggleExpanded, isLoading: loading }}>
        <Component
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(
            styles.card,
            styles[variant],
            styles[size],
            interactive && styles.interactive,
            collapsible && styles.collapsible,
            loading && styles.loading,
            className
          )}
          onClick={onClick}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={interactive && onClick ? (e) => e.key === 'Enter' && onClick(e as unknown as React.MouseEvent<HTMLDivElement>) : undefined}
          {...props}
        >
          {children}
        </Component>
      </CardContext.Provider>
    );
  }
);
Card.displayName = 'Card';

// Compound: Card.Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, icon, children, ...props }, ref) => {
    const { isCollapsible, isExpanded, toggleExpanded } = useContext(CardContext);

    const handleClick = isCollapsible ? toggleExpanded : undefined;
    const handleKeyDown = isCollapsible
      ? (e: React.KeyboardEvent) => e.key === 'Enter' && toggleExpanded()
      : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          styles.header,
          isCollapsible && styles.headerCollapsible,
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isCollapsible ? 'button' : undefined}
        tabIndex={isCollapsible ? 0 : undefined}
        aria-expanded={isCollapsible ? isExpanded : undefined}
        {...props}
      >
        <div className={styles.headerContent}>
          {icon && <span className={styles.headerIcon}>{icon}</span>}
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {children}
          </div>
        </div>
        <div className={styles.headerActions}>
          {action}
          {isCollapsible && (
            <ChevronDown
              className={cn(styles.chevron, isExpanded && styles.chevronExpanded)}
              size={20}
            />
          )}
        </div>
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

// Compound: Card.Body
const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsible, isExpanded, isLoading } = useContext(CardContext);

    if (isCollapsible && !isExpanded) {
      return null;
    }

    if (isLoading) {
      return (
        <div ref={ref} className={cn(styles.body, className)} {...props}>
          <CardSkeleton />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(styles.body, isCollapsible && styles.bodyCollapsible, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBody.displayName = 'CardBody';

// Compound: Card.Footer
const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsible, isExpanded } = useContext(CardContext);

    if (isCollapsible && !isExpanded) {
      return null;
    }

    return (
      <div ref={ref} className={cn(styles.footer, className)} {...props}>
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

// Compound: Card.Image
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  position?: 'top' | 'body';
}

const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, position = 'body', alt = '', ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn(
          styles.image,
          position === 'top' && styles.imageTop,
          className
        )}
        alt={alt}
        {...props}
      />
    );
  }
);
CardImage.displayName = 'CardImage';

// Skeleton Loading Component
const CardSkeleton = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonLine} style={{ width: '70%' }} />
    <div className={styles.skeletonLine} style={{ width: '100%' }} />
    <div className={styles.skeletonLine} style={{ width: '85%' }} />
  </div>
);

// Export compound components
export { Card, CardHeader, CardBody, CardFooter, CardImage, CardSkeleton };
