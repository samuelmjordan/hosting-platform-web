import { Button } from "@/components/ui/button";

const Footer = () => {
    return(
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">About</Button>
            <Button variant="ghost" size="sm">Blog</Button>
            <Button variant="ghost" size="sm">Contact</Button>
        </div>
    );
};

export default Footer;