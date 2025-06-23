const Footer = () => {
    const footerItems = [
        { label: 'Help', href: '/help' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
    ];

    return(
        <footer className="mt-auto border-t border-border bg-background">
            <div className="grid grid-cols-3 items-center p-4 w-full">
                <div className="text-left flex items-center">
            <span className="text-muted-foreground px-3 text-sm font-medium">
                2025 Musdev Limited
            </span>
                    <img
                        src="/musdev.png"
                        alt="musdec_logo"
                        className="h-16"
                    />
                </div>
                <div>
                </div>
                <div className="flex justify-end">
                    {footerItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground px-3 text-sm font-medium transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;