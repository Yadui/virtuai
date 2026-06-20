import { LucideIcon } from "lucide-react";

interface HeadingProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?: string;
}

export const Heading = ({
    title,
    description,
    icon: Icon,
    iconColor: _iconColor,
    bgColor: _bgColor,
}: HeadingProps) => {


    return (
        <>
            <div className="border-b border-[#e6e5e0] bg-[#f7f7f4] px-4 py-8 lg:px-8">
                <div className="flex items-center gap-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#e6e5e0] bg-white text-[#26251e]">
                    <Icon className="h-5 w-5" />
                </div>
                
                <div>
                    <h2 className="text-3xl font-normal tracking-normal text-[#26251e]">{title}</h2>
                    <p className="mt-1 text-sm text-[#5a5852]">
                        {description}
                    </p>
                </div>
                </div>
            </div>
        </>
    );
};