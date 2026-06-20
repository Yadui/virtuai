"use client";

import axios from "axios";
import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { toast } from "react-hot-toast";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";



import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { tools } from "@/constants";
import { Card } from "@/components/ui/card";




export const ProModal = () => {

    const proModal = useProModal();
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url;
        } 
        catch (error) {
            toast.error("Something went wrong");
        } 
        finally {
            setLoading(false);
        }
    }



    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 text-xl font-semibold text-[#26251e]">
                            Upgrade to VirtuAI
                            <Badge 
                                variant="default" 
                                className="uppercase text-sm py-1"
                            >
                                pro
                            </Badge>
                        </div>
                    </DialogTitle>

                    <DialogDescription className="space-y-2 pt-2 text-center font-medium text-[#26251e]">
                        {tools.map((tool) => (
                            <Card key={tool.href} className="flex items-center justify-between border-[#e6e5e0] bg-white p-3">
                                <div className="flex items-center gap-x-4">
                                    <div className="w-fit rounded-md border border-[#e6e5e0] bg-[#fafaf7] p-2 text-[#26251e]">
                                        <tool.icon className="h-5 w-5" />
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>
                                <Check className="text-primary w-5 h-5" />
                            </Card>
                        ))}
                    </DialogDescription>

                </DialogHeader>


                <DialogFooter>
                    <Button 
                        disabled={loading} 
                        onClick={onSubscribe} 
                        size="lg" 
                        variant="default" 
                        className="w-full"
                    >
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </DialogFooter>


            </DialogContent>

        </Dialog>
    );
};