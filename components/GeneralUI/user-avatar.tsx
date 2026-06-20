import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback>LU</AvatarFallback>
    </Avatar>
  );
};
