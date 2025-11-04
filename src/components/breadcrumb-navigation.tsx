import { Button } from "@heroui/react";

export type BreadcrumbStep<T extends string = string> = {
    key: T;
    label: string;
};

export type StepStatus = "completed" | "current" | "incomplete" | "not-started";

interface BreadcrumbNavigationProps<T extends string = string> {
    steps: BreadcrumbStep<T>[];
    currentStep: T;
    completedSteps: Set<T>;
    incompleteSteps: Set<T>;
    onStepClick: (stepKey: T) => void;
}

// Simple SVG icon components
const CheckCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const AlertCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const CircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
    </svg>
);

export function BreadcrumbNavigation<T extends string = string>({
    steps,
    currentStep,
    completedSteps,
    incompleteSteps,
    onStepClick,
}: BreadcrumbNavigationProps<T>) {
    const getStepStatus = (stepKey: T): StepStatus => {
        if (stepKey === currentStep) {
            return "current";
        }
        if (completedSteps.has(stepKey)) {
            return "completed";
        }
        if (incompleteSteps.has(stepKey)) {
            return "incomplete";
        }
        return "not-started";
    };

    const getStepIcon = (status: StepStatus) => {
        switch (status) {
            case "completed":
                return <CheckCircleIcon />;
            case "incomplete":
                return <AlertCircleIcon />;
            case "current":
            case "not-started":
                return <CircleIcon />;
        }
    };

    const getStepColor = (status: StepStatus) => {
        switch (status) {
            case "completed":
                return "success";
            case "current":
                return "primary";
            case "incomplete":
                return "danger";
            case "not-started":
                return "default";
        }
    };

    const getStepVariant = (status: StepStatus) => {
        switch (status) {
            case "current":
                return "solid";
            case "completed":
            case "incomplete":
                return "flat";
            case "not-started":
                return "light";
        }
    };

    return (
        <nav
            aria-label="Character builder steps"
            style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            {steps.map((step, index) => {
                const status = getStepStatus(step.key);
                const color = getStepColor(status);
                const variant = getStepVariant(status);

                return (
                    <div key={step.key} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Button
                            size="sm"
                            color={color}
                            variant={variant}
                            onPress={() => onStepClick(step.key)}
                            startContent={getStepIcon(status)}
                            aria-current={status === "current" ? "step" : undefined}
                            aria-label={`${step.label} - ${status === "completed" ? "completed" : status === "incomplete" ? "incomplete" : status === "current" ? "current step" : "not started"}`}
                            style={{
                                minWidth: "fit-content",
                            }}
                        >
                            {index + 1}. {step.label}
                        </Button>
                        {index < steps.length - 1 && (
                            <span
                                style={{
                                    color: "var(--heroui-default-400)",
                                    fontSize: "0.875rem",
                                }}
                                aria-hidden="true"
                            >
                                →
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
