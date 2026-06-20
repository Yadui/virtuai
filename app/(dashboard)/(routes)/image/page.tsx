"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/Header/heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Empty } from "@/components/GeneralUI/empty";
import { Loader } from "@/components/GeneralUI/loader";

//- Form Schema and hooks :
import * as z from "zod";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//- Form related
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

//- Api req
import axios from "axios";

//- Response from server
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { amountOptions, resolutionOptions } from "./constants";

//- Display Image :
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Download } from "lucide-react";

//- Pro modal and error handling
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { FreeCounter } from "@/components/SubscriptionModel/free-counter";

const ImagePage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // prompt: "Enter Prompt...",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Example of handling the response on the client side
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]); // Clear previous images

      const response = await axios.post("/api/image", values);

      if (response.data.images) {
        setImages(response.data.images);
      }
      {
        FreeCounter;
      }

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f7f7f4] text-[#26251e]">
      <Heading
        title="Image Generation"
        description="Turn your prompts into Image."
        icon={ImageIcon}
        iconColor="text-[#26251e]"
        bgColor="bg-white"
      />
      <div className="px-4 py-6 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-12 gap-3 rounded-xl border border-[#e6e5e0] bg-white p-4 px-3 md:px-6"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-[#e6e5e0] outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Enter request here..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
                variant="default"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="rounded-xl border border-[#e6e5e0] bg-white p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label="No images generated." />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden rounded-xl border-[#e6e5e0] bg-white">
                <div className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Generated image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(image)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
