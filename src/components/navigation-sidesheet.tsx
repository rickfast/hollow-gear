import { Button, Link, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface MenuItem {
    name: string;
    path: string;
    key: string;
}

const menuItems: MenuItem[] = [
    { name: "Characters", path: "/", key: "characters" },
    { name: "Build Character", path: "/builder", key: "build" },
    { name: "Drones", path: "/drones", key: "drones" },
    { name: "Build Drone", path: "/drones/new", key: "drone-build" },
    { name: "Reference", path: "/reference", key: "reference" },
    { name: "Rules", path: "/rules", key: "rules" },
];

export function NavigationSidesheet() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const handleNavigation = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Header Bar */}
            <div className="border-b border-divider bg-background sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => setIsOpen(true)}
                        aria-label="Open navigation menu"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </Button>

                    <RouterLink to="/" onClick={() => setIsOpen(false)}>
                        <img
                            src="/logo.png"
                            alt="Hollow Gear 5E"
                            className="h-10 w-auto object-contain cursor-pointer"
                        />
                    </RouterLink>

                    <div className="w-10" />
                </div>
            </div>

            {/* Navigation Sidesheet */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                hideCloseButton
                classNames={{
                    wrapper: "!items-start !justify-start",
                    base: "!m-0 !max-w-[280px] !h-screen !rounded-none sm:!rounded-r-lg",
                    backdrop: "bg-black/50",
                }}
                motionProps={{
                    variants: {
                        enter: {
                            x: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        },
                        exit: {
                            x: -300,
                            opacity: 0,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn",
                            },
                        },
                    },
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center justify-between gap-1 pb-4">
                                <img
                                    src="/logo.png"
                                    alt="Hollow Gear 5E"
                                    className="h-10 w-auto object-contain"
                                />
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    onPress={onClose}
                                    aria-label="Close menu"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </Button>
                            </ModalHeader>
                            <ModalBody className="pt-0">
                                <nav className="flex flex-col gap-1">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.key}
                                            as={RouterLink}
                                            to={item.path}
                                            color={
                                                location.pathname === item.path
                                                    ? "primary"
                                                    : "foreground"
                                            }
                                            className="cursor-pointer text-lg py-3 px-3 rounded-lg hover:bg-default-100 transition-colors"
                                            onPress={handleNavigation}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
