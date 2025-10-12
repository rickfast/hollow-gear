import type { ReactNode } from "react";

/**
 * Typography Components
 *
 * Consistent typography patterns used across character sheet components.
 * All components use a standardized visual hierarchy:
 * - Titles: text-base, bold
 * - Values: text-sm, semibold
 * - Labels: text-xs, default-500
 * - Secondary info: text-xs, default-400
 */

// ============================================================================
// TITLES & HEADINGS
// ============================================================================

export const CardTitle = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => <h3 className={`font-bold text-base ${className}`}>{children}</h3>;

// ============================================================================
// LABELS & VALUES
// ============================================================================

interface StatProps {
    label: string;
    value: ReactNode;
    valueClassName?: string;
}

/**
 * Standard label-value pair used for displaying stats
 * Example: "Hit: +5", "Range: 30 feet", "Cost: 3 AFP"
 */
export const Stat = ({ label, value, valueClassName = "" }: StatProps) => (
    <div className="flex items-baseline gap-1">
        <span className="text-xs text-default-500">{label}:</span>
        <span className={`text-sm font-semibold ${valueClassName}`}>{value}</span>
    </div>
);

/**
 * Stat with primary (blue) colored value
 * Used for important values like costs, bonuses, etc.
 */
export const PrimaryStat = ({ label, value }: { label: string; value: ReactNode }) => (
    <Stat label={label} value={value} valueClassName="text-primary" />
);

/**
 * Stat with danger (red) colored value
 * Used for damage, heat, etc.
 */
export const DangerStat = ({ label, value }: { label: string; value: ReactNode }) => (
    <Stat label={label} value={value} valueClassName="text-danger" />
);

/**
 * Stat with warning (orange) colored value
 */
export const WarningStat = ({ label, value }: { label: string; value: ReactNode }) => (
    <Stat label={label} value={value} valueClassName="text-warning" />
);

// ============================================================================
// STAT GROUPS
// ============================================================================

/**
 * Container for multiple stats displayed in a row with consistent spacing
 */
export const StatRow = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-wrap gap-3 mb-2">{children}</div>
);

// ============================================================================
// TEXT BLOCKS
// ============================================================================

/**
 * Standard description text
 */
export const Description = ({ children }: { children: ReactNode }) => (
    <p className="text-sm text-default-600 mb-2">{children}</p>
);

/**
 * Secondary/helper text
 */
export const SecondaryText = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => <span className={`text-xs text-default-500 ${className}`}>{children}</span>;

/**
 * Tertiary/muted text
 */
export const TertiaryText = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => <span className={`text-xs text-default-400 ${className}`}>{children}</span>;

// ============================================================================
// EMPTY STATES
// ============================================================================

/**
 * Empty state message centered with muted text
 */
export const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-8 text-default-400">
        <p>{message}</p>
    </div>
);

// ============================================================================
// VALUE DISPLAYS
// ============================================================================

/**
 * Display a value with consistent font weight
 */
export const Value = ({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) => <span className={`text-sm font-semibold ${className}`}>{children}</span>;

/**
 * Display a label without a value
 */
export const Label = ({ children }: { children: ReactNode }) => (
    <span className="text-xs text-default-500">{children}</span>
);
