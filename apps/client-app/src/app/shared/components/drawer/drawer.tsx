import {
  Drawer as HRDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/drawer";
import { useDrawerStore } from "./use-drawer.store";

export const Drawer = () => {
  const { closeDrawer, title, content, isOpen } = useDrawerStore();

  return (
    <HRDrawer isOpen={isOpen} onOpenChange={closeDrawer}>
      <DrawerContent>
        {title && <DrawerHeader>{title}</DrawerHeader>}
        <DrawerBody>{content}</DrawerBody>
      </DrawerContent>
    </HRDrawer>
  );
};
