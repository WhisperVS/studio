
"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/datepicker";
import { Combobox } from "@/components/ui/combobox";
import { Asset, AssetFormSchema, AssetFormValues } from "@/lib/types";
import { APP_CONFIG } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "./user-provider";

interface EditAssetDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAssetUpdated: () => void;
}

export function EditAssetDialog({ asset, isOpen, onOpenChange, onAssetUpdated }: EditAssetDialogProps) {
  const { toast } = useToast();
  const { currentUser } = useUser();

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(AssetFormSchema),
    defaultValues: {
      machineName: '',
      category: 'laptops',
      os: '',
      location: 'Schaumburg IL',
      manufacturer: '',
      partNumber: '',
      modelNumber: '',
      serialNumber: '',
      type: undefined,
      assignedUser: '',
      userId: undefined,
      userType: 'local',
      owner: 'Group Administrators',
      status: 'In Use',
      notes: '',
      purchaseDate: undefined,
      warrantyExpirationDate: undefined
    }
  });

  useEffect(() => {
    if (asset && isOpen) {
      form.reset({
        ...asset,
        os: asset.os ?? '',
        type: asset.type ?? undefined,
        assignedUser: asset.assignedUser ?? '',
        userId: asset.userId ?? undefined,
        notes: asset.notes ?? '',
        owner: "Group Administrators"
      });
    }
  }, [asset, form, isOpen]);


  const category = form.watch("category");

  const onSubmit = useCallback(async (data: AssetFormValues) => {
    if (!asset) return;

    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a user before editing an asset.",
      });
      return;
    }

    const dataToSend = {
      ...data,
      purchaseDate: data.purchaseDate || null,
      warrantyExpirationDate: data.warrantyExpirationDate || null,
      type: data.type || null,
      updatedBy: currentUser,
    };

    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to update asset');
      }

      toast({
        title: "Asset Updated",
        description: `${data.machineName} has been updated.`,
      });
      onAssetUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update the asset.",
      });
    }
  }, [asset, onAssetUpdated, toast, onOpenChange, form, currentUser]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>
            Update the details for "{asset?.machineName}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{APP_CONFIG.labels.owner}</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="machineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.machineName}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., WKSTN-DEV-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.category}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.manufacturer}</FormLabel>
                    <Combobox
                      options={APP_CONFIG.manufacturers.map(m => ({ value: m, label: m }))}
                      value={field.value}
                      onChange={(value) => form.setValue('manufacturer', value || '', { shouldValidate: true })}
                      placeholder="Select or type manufacturer..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.location}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.modelNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Latitude 5420" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.partNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., HJVX6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.serialNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5J2X1Y2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="os"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.os}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Windows 11 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(category === 'systems' || category === 'servers') && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{APP_CONFIG.labels.type}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select a ${category.slice(0, -1)} type`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(category === 'systems' ? APP_CONFIG.systemTypes : APP_CONFIG.serverTypes).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.status}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.statuses.map((status) => (
                          <SelectItem key={status.name} value={status.name}>{status.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <p className="font-medium text-sm text-foreground mb-3">User Assignment</p>
              </div>
              <FormField
                control={form.control}
                name="assignedUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.assignedUser}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.userId}</FormLabel>
                    <FormControl>
                      <Input type="text" inputMode="numeric" placeholder="e.g., 12345" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem className="space-y-3 pt-2">
                      <FormLabel>{APP_CONFIG.labels.userType}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="local" />
                            </FormControl>
                            <FormLabel className="font-normal">Local</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="remote" />
                            </FormControl>
                            <FormLabel className="font-normal">Remote</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{APP_CONFIG.labels.purchaseDate}</FormLabel>
                    <DatePicker 
                      date={field.value ?? undefined} 
                      setDate={(d) => field.onChange(d === undefined ? null : d)} 
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{APP_CONFIG.labels.warrantyExpirationDate}</FormLabel>
                    <DatePicker 
                      date={field.value ?? undefined} 
                      setDate={(d) => field.onChange(d === undefined ? null : d)} 
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{APP_CONFIG.labels.notes}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Purchased from Dell Outlet. Has a scratch on the top case. Comes with a 24-inch Dell UltraSharp monitor."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
