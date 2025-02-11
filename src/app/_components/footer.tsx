import { Button } from "@/components/ui/button";

const Footer = () => {
    const footerItems = [
        { label: 'Help', href: '/help' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
    ];

    return(
        <footer className="mt-auto border-t bg-white">
            <div className="grid grid-cols-3 items-center p-8 w-full">
                <div className="text-left">
                    <span className="text-gray-600 px-3 text-sm font-medium">
                        2025 MyCompany ltd
                    </span>
                </div>
                <div>
                </div>
                <div className="flex justify-end">
                    {footerItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-gray-600 hover:text-gray-900 px-3 text-sm font-medium"
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